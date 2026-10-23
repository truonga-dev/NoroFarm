from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.models.user import User, Profile
from app.schemas.auth import Register, Login, Token
from app.schemas.user import UserCreate
from app.repositories.user import UserRepository
from app.core.security import (
    get_password_hash, verify_password,
    create_access_token, create_refresh_token,
)
from app.core.config import settings
from app.core.email import send_password_reset_email, send_email_verification
from jose import jwt, JWTError

EMAIL_TOKEN_TYPE_RESET = "password_reset"
EMAIL_TOKEN_TYPE_VERIFY = "email_verify"


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)

    async def register(self, data: Register) -> User:
        existing_user = await self.user_repo.get_by_email(data.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email đã được đăng ký")

        hashed_password = get_password_hash(data.password)
        new_user = User(
            email=data.email,
            hashed_password=hashed_password,
            is_active=True,
            is_verified=False,
        )
        profile = Profile(full_name=data.full_name)
        new_user.profile = profile

        created_user = await self.user_repo.create(new_user)

        # Gửi email xác minh sau khi đăng ký
        verify_token = create_access_token(
            subject=str(created_user.id),
            expires_delta=timedelta(hours=settings.EMAIL_TOKEN_EXPIRE_HOURS),
            token_type=EMAIL_TOKEN_TYPE_VERIFY,
        )
        await send_email_verification(created_user.email, verify_token)

        # Reload created_user to get relationships (profile, roles) eagerly loaded
        loaded_user = await self.user_repo.get_by_id(created_user.id)

        return loaded_user

    async def login(self, data: Login) -> Token:
        user = await self.user_repo.get_by_email(data.email)
        if not user or not verify_password(data.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Email hoặc mật khẩu không đúng")

        if not user.is_active:
            raise HTTPException(status_code=400, detail="Tài khoản đã bị vô hiệu hóa")

        access_token = create_access_token(subject=user.id, token_type="access")
        refresh_token = create_refresh_token(subject=user.id)

        return Token(access_token=access_token, refresh_token=refresh_token, token_type="bearer")

    async def forgot_password(self, email: str) -> None:
        """Tạo token đặt lại mật khẩu và gửi email."""
        user = await self.user_repo.get_by_email(email)
        # Luôn trả về thành công để tránh email enumeration attack
        if not user:
            return

        reset_token = create_access_token(
            subject=str(user.id),
            expires_delta=timedelta(hours=settings.EMAIL_TOKEN_EXPIRE_HOURS),
            token_type=EMAIL_TOKEN_TYPE_RESET,
        )
        await send_password_reset_email(user.email, reset_token)

    async def reset_password(self, token: str, new_password: str) -> None:
        """Xác thực token và đặt lại mật khẩu."""
        credentials_exception = HTTPException(
            status_code=400,
            detail="Token không hợp lệ hoặc đã hết hạn",
        )
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id: str = payload.get("sub")
            token_type: str = payload.get("type")
            if user_id is None or token_type != EMAIL_TOKEN_TYPE_RESET:
                raise credentials_exception
        except JWTError:
            raise credentials_exception

        user = await self.user_repo.get_by_id(int(user_id))
        if not user:
            raise credentials_exception

        user.hashed_password = get_password_hash(new_password)
        await self.user_repo.update(user)

    async def verify_email(self, token: str) -> None:
        """Xác minh email bằng token."""
        credentials_exception = HTTPException(
            status_code=400,
            detail="Token xác minh không hợp lệ hoặc đã hết hạn",
        )
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id: str = payload.get("sub")
            token_type: str = payload.get("type")
            if user_id is None or token_type != EMAIL_TOKEN_TYPE_VERIFY:
                raise credentials_exception
        except JWTError:
            raise credentials_exception

        user = await self.user_repo.get_by_id(int(user_id))
        if not user:
            raise credentials_exception

        if user.is_verified:
            return  # Đã xác minh rồi, không cần làm gì

        user.is_verified = True
        await self.user_repo.update(user)
