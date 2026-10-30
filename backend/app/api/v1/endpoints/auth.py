from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.schemas.auth import Register, Login, Token, ForgotPassword, ResetPassword, VerifyEmail
from app.schemas.user import UserResponse
from app.services.auth import AuthService
from app.common.response import ResponseModel, success_response
from app.core.config import settings

router = APIRouter()


@router.post("/register", response_model=ResponseModel[UserResponse], status_code=status.HTTP_201_CREATED)
async def register(data: Register, db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    user = await auth_service.register(data)
    return success_response(data=user, message="Đăng ký thành công. Vui lòng kiểm tra email để xác minh tài khoản.")


@router.post("/login", response_model=ResponseModel[Token])
async def login(data: Login, response: Response, db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    token = await auth_service.login(data)
    # Set HttpOnly cookies - secure=False khi chạy HTTP (chưa cấu hình HTTPS/SSL)
    response.set_cookie(
        key="access_token",
        value=token.access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        path="/",
        max_age=30 * 24 * 3600,  # 30 days
    )
    if token.refresh_token:
        response.set_cookie(
            key="refresh_token",
            value=token.refresh_token,
            httponly=True,
            secure=False,
            samesite="lax",
            path="/",
            max_age=7 * 24 * 3600,  # 7 days
        )

    return success_response(data=token, message="Đăng nhập thành công")


@router.post("/logout", response_model=ResponseModel[None])
async def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=False,
        samesite="lax",
        path="/"
    )
    response.delete_cookie(
        key="refresh_token",
        httponly=True,
        secure=False,
        samesite="lax",
        path="/"
    )
    return success_response(data=None, message="Đăng xuất thành công")


@router.post("/forgot-password", response_model=ResponseModel[None])
async def forgot_password(data: ForgotPassword, db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    await auth_service.forgot_password(data.email)
    # Luôn trả về thành công để tránh email enumeration attack
    return success_response(
        data=None,
        message="Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu."
    )


@router.post("/reset-password", response_model=ResponseModel[None])
async def reset_password(data: ResetPassword, db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    await auth_service.reset_password(data.token, data.new_password)
    return success_response(data=None, message="Mật khẩu đã được đặt lại thành công")


@router.post("/verify-email", response_model=ResponseModel[None])
async def verify_email(data: VerifyEmail, db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    await auth_service.verify_email(data.token)
    return success_response(data=None, message="Email đã được xác minh thành công")
