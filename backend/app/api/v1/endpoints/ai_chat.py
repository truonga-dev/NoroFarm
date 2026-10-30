from typing import List
from fastapi import APIRouter, status
from app.schemas.ai_chat import ChatRequest, ChatResponse
from app.services.ai_chat import ai_chat_service, DEFAULT_SUGGESTIONS
from app.common.response import ResponseModel, success_response

router = APIRouter()

@router.post("/chat", response_model=ResponseModel[ChatResponse], status_code=status.HTTP_200_OK)
async def chat_with_norofarm_ai(payload: ChatRequest):
    """
    Chatbot NoroFarm AI - Tư vấn giá nông sản, kỹ thuật canh tác, thời tiết và thị trường.
    Tích hợp Google Gemini AI API.
    """
    response = await ai_chat_service.chat(
        user_msg=payload.message,
        history=payload.history
    )
    return success_response(data=response)

@router.get("/suggestions", response_model=ResponseModel[List[str]])
async def get_chat_suggestions():
    """Lấy danh sách các câu hỏi gợi ý phổ biến cho bà con nông dân"""
    return success_response(data=DEFAULT_SUGGESTIONS)
