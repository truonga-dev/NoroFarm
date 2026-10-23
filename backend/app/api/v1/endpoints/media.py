from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
import shutil
import os
import uuid
from app.common.response import ResponseModel, success_response
from app.dependencies.auth import get_current_active_user, RoleChecker
from app.models.user import User

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=ResponseModel[dict])
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(RoleChecker(["admin", "editor", "writer"]))
):
    """API upload hình ảnh"""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File type not supported. Only images are allowed.")
        
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return success_response(
        data={"url": f"/uploads/{filename}"},
        message="Upload thành công"
    )
