import logging
import aiosmtplib
from email.message import EmailMessage
from app.core.config import settings
from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.host = settings.SMTP_HOST
        self.port = settings.SMTP_PORT
        self.user = settings.SMTP_USER
        self.password = settings.SMTP_PASSWORD
        self.use_tls = settings.SMTP_TLS
        self.from_email = settings.EMAIL_FROM_ADDRESS or self.user
        self.from_name = settings.EMAIL_FROM_NAME

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def _send_email(self, email_message: EmailMessage) -> bool:
        if not self.host or not self.user or not self.password:
            logger.warning("SMTP config is missing. Simulating email send.")
            logger.info(f"--- SIMULATED EMAIL ---\\nTo: {email_message['To']}\\nSubject: {email_message['Subject']}\\nBody: {email_message.get_content()}\\n-----------------------")
            return True

        try:
            if self.use_tls:
                await aiosmtplib.send(
                    email_message,
                    hostname=self.host,
                    port=self.port,
                    start_tls=True,
                    username=self.user,
                    password=self.password,
                )
            else:
                await aiosmtplib.send(
                    email_message,
                    hostname=self.host,
                    port=self.port,
                    username=self.user,
                    password=self.password,
                )
            logger.info(f"Email sent successfully to {email_message['To']}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email to {email_message['To']}: {str(e)}")
            raise

    async def send_verification_email(self, email_to: str, token: str) -> bool:
        verify_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
        
        message = EmailMessage()
        message["From"] = f"{self.from_name} <{self.from_email}>"
        message["To"] = email_to
        message["Subject"] = f"[{settings.PROJECT_NAME}] Xác thực địa chỉ email"
        
        body = f"""
Xin chào,

Bạn vừa đăng ký tài khoản tại {settings.PROJECT_NAME}.
Vui lòng click vào đường link dưới đây để xác thực địa chỉ email của bạn:

{verify_url}

Link này sẽ hết hạn trong {settings.EMAIL_TOKEN_EXPIRE_HOURS} giờ.
Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.

Trân trọng,
Đội ngũ {settings.PROJECT_NAME}
"""
        message.set_content(body)
        return await self._send_email(message)

    async def send_password_reset_email(self, email_to: str, token: str) -> bool:
        reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        
        message = EmailMessage()
        message["From"] = f"{self.from_name} <{self.from_email}>"
        message["To"] = email_to
        message["Subject"] = f"[{settings.PROJECT_NAME}] Khôi phục mật khẩu"
        
        body = f"""
Xin chào,

Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn.
Vui lòng click vào đường link dưới đây để đặt lại mật khẩu:

{reset_url}

Link này sẽ hết hạn trong {settings.EMAIL_TOKEN_EXPIRE_HOURS} giờ.
Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này và bảo mật tài khoản của mình.

Trân trọng,
Đội ngũ {settings.PROJECT_NAME}
"""
        message.set_content(body)
        return await self._send_email(message)

    async def send_contact_reply_email(self, email_to: str, customer_name: str, original_message: str, reply_content: str) -> bool:
        message = EmailMessage()
        message["From"] = f"{self.from_name} <{self.from_email}>"
        message["To"] = email_to
        message["Subject"] = f"[{settings.PROJECT_NAME}] Phản hồi về thư liên hệ của bạn"
        
        body = f"""Xin chào {customer_name},

Cảm ơn bạn đã gửi liên hệ tới {settings.PROJECT_NAME}.
Chúng tôi xin gửi phản hồi về tin nhắn của bạn như sau:

--------------------------------------------------
{reply_content}
--------------------------------------------------

Nội dung thư liên hệ ban đầu của bạn:
"{original_message}"

Trân trọng,
Ban quản trị {settings.PROJECT_NAME}
"""
        message.set_content(body)
        return await self._send_email(message)

email_service = EmailService()
