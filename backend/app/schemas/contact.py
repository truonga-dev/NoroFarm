from pydantic import BaseModel, ConfigDict, EmailStr
from typing import Optional, List
from datetime import datetime

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str

class ContactReply(BaseModel):
    reply_content: str

class ContactResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    phone: Optional[str] = None
    subject: str
    message: str
    reply_content: Optional[str] = None
    is_replied: bool
    replied_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

class ContactListResponse(BaseModel):
    items: List[ContactResponse]
    total: int
    page: int
    size: int
    pages: int
