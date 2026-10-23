from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import EmailStr
from app.core.email import send_password_reset_email
from app.common.response import success_response, error_response
from app.dependencies.auth import RoleChecker
from app.models.user import User

router = APIRouter()

@router.get("")
async def test_send_email(
    email: str,
    current_user: User = Depends(RoleChecker(["admin"]))
):
    """
    Endpoint dùng để test chức năng gửi email qua SMTP (Chỉ dành cho Admin)
    """
    # Gửi thử 1 email reset mật khẩu (dữ liệu giả)
    success = await send_password_reset_email(email, "TEST_TOKEN_12345")
    
    if success:
        return success_response(data={"email": email}, message="Email test đã được gửi thành công. Vui lòng kiểm tra hộp thư của bạn (cả mục Spam).")
    else:
        return error_response(message="Không thể gửi email. Hãy kiểm tra lại cấu hình SMTP trong file .env và log server.")
