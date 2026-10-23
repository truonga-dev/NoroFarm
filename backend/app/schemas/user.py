from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class ProfileBase(BaseModel):
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    avatar_url: Optional[str] = None

class ProfileResponse(ProfileBase):
    id: int
    user_id: int

    model_config = {"from_attributes": True}

class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoleResponse(RoleBase):
    id: int

    model_config = {"from_attributes": True}

class UserBase(BaseModel):
    email: EmailStr
    is_active: bool = True
    is_verified: bool = False

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    avatar_url: Optional[str] = None

class UserChangePassword(BaseModel):
    old_password: str
    new_password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    profile: Optional[ProfileResponse] = None
    roles: List[RoleResponse] = Field(default_factory=list)

    model_config = {"from_attributes": True}
