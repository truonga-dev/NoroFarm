from typing import Any, Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

# --- Banner ---
class BannerBase(BaseModel):
    title: str
    image_url: str
    link_url: Optional[str] = None
    position: str = "home_main"
    display_order: int = 0
    is_active: bool = True

class BannerCreate(BannerBase):
    pass

class UserRoleUpdate(BaseModel):
    roles: List[str]

class BannerUpdate(BaseModel):
    title: Optional[str] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    position: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None

class BannerResponse(BannerBase):
    id: int
    created_at: datetime
    
    model_config = {"from_attributes": True}

# --- Announcement ---
class AnnouncementBase(BaseModel):
    title: str
    content: str
    is_active: bool = True
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class AnnouncementCreate(AnnouncementBase):
    pass

class AnnouncementUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_active: Optional[bool] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

class AnnouncementResponse(AnnouncementBase):
    id: int
    created_at: datetime
    
    model_config = {"from_attributes": True}

# --- System Setting ---
class SystemSettingBase(BaseModel):
    key: str
    value: str
    description: Optional[str] = None

class SystemSettingCreate(SystemSettingBase):
    pass

class SystemSettingUpdate(BaseModel):
    value: str

class SystemSettingResponse(SystemSettingBase):
    id: int
    
    model_config = {"from_attributes": True}

# --- Audit Log ---
class AuditLogResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    action: str
    resource: str
    resource_id: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    created_at: datetime
    
    model_config = {"from_attributes": True}

class AuditLogListResponse(BaseModel):
    items: List[AuditLogResponse]
    total: int
    page: int
    size: int
    pages: int

# --- Analytics ---
class ChartDataPoint(BaseModel):
    name: str
    views: int
    users: int

class DashboardAnalyticsResponse(BaseModel):
    total_users: int
    total_commodities: int
    total_articles: int
    active_announcements: int
    recent_activities: List[AuditLogResponse]
    traffic_data: List[ChartDataPoint]
