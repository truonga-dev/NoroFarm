from fastapi import APIRouter, Depends, Query, Path, BackgroundTasks, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import Optional, List
from datetime import datetime, timezone

from app.database.database import get_db
from app.dependencies.auth import get_current_user, RoleChecker
from app.models.user import User
from app.models.contact import Contact
from app.schemas.contact import ContactCreate, ContactReply, ContactResponse, ContactListResponse
from app.common.response import ResponseModel, success_response
from app.services.email import email_service

router = APIRouter()

# --- Public Endpoints ---
@router.post("", response_model=ResponseModel[ContactResponse])
async def create_contact(
    data: ContactCreate,
    db: AsyncSession = Depends(get_db)
):
    """Khách hàng gửi liên hệ"""
    contact = Contact(**data.model_dump())
    db.add(contact)
    await db.commit()
    await db.refresh(contact)
    return success_response(data=contact, message="Gửi liên hệ thành công")

# --- Admin Endpoints ---
@router.get("/admin", response_model=ResponseModel[ContactListResponse])
async def get_contacts(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    is_replied: Optional[bool] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """Admin lấy danh sách liên hệ của khách hàng"""
    query = select(Contact).order_by(Contact.created_at.desc())
    if is_replied is not None:
        query = query.filter(Contact.is_replied == is_replied)
        
    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query) or 0
    
    # Paginate
    query = query.offset((page - 1) * size).limit(size)
    result = await db.execute(query)
    items = result.scalars().all()
    
    pages = (total + size - 1) // size
    data = {
        "items": items,
        "total": total,
        "page": page,
        "size": size,
        "pages": pages
    }
    return success_response(data=data)

@router.post("/admin/{id}/reply", response_model=ResponseModel[ContactResponse])
async def reply_contact(
    background_tasks: BackgroundTasks,
    data: ContactReply,
    id: int = Path(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """Admin trả lời liên hệ và gửi email cho khách hàng"""
    contact = await db.get(Contact, id)
    if not contact:
        raise HTTPException(status_code=404, detail="Không tìm thấy liên hệ")
        
    contact.reply_content = data.reply_content
    contact.is_replied = True
    contact.replied_at = datetime.now(timezone.utc)
    
    await db.commit()
    await db.refresh(contact)
    
    # Send email in background
    background_tasks.add_task(
        email_service.send_contact_reply_email,
        email_to=contact.email,
        customer_name=contact.name,
        original_message=contact.message,
        reply_content=data.reply_content
    )
    
    return success_response(data=contact, message="Đã gửi phản hồi thành công")
