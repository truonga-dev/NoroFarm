from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime, timezone

class ChatMessage(BaseModel):
    role: str = Field(..., description="user, model, assistant hoặc system")
    content: str = Field(..., description="Nội dung tin nhắn")

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, description="Câu hỏi hoặc yêu cầu gửi tới NoroFarm AI")
    history: Optional[List[ChatMessage]] = Field(default_factory=list, description="Lịch sử hội thoại trước đó")
    stream: bool = Field(default=False, description="Có trả về dạng stream hay không")

class ChatResponse(BaseModel):
    reply: str = Field(..., description="Câu trả lời từ NoroFarm AI")
    suggestions: List[str] = Field(default_factory=list, description="Gợi ý câu hỏi tiếp theo")
    model: str = Field(default="gemini-2.5-flash", description="Model AI xử lý")
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
