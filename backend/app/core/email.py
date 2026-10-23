"""
Email service sử dụng aiosmtplib để gửi email bất đồng bộ.
"""
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

import aiosmtplib

from app.core.config import settings

logger = logging.getLogger(__name__)


async def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    text_content: Optional[str] = None,
) -> bool:
    """
    Gửi email bất đồng bộ qua SMTP.
    Trả về True nếu thành công, False nếu thất bại.
    """
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.warning(
            "SMTP_USER hoặc SMTP_PASSWORD chưa được cấu hình. "
            "Email sẽ không được gửi. Kiểm tra file .env"
        )
        # Trong môi trường dev, log nội dung email thay vì gửi
        logger.info(f"[DEV EMAIL] To: {to_email} | Subject: {subject}")
        logger.info(f"[DEV EMAIL] Content: {html_content}")
        return True  # Không fail để không block luồng auth

    from_address = settings.EMAIL_FROM_ADDRESS or settings.SMTP_USER

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = f"{settings.EMAIL_FROM_NAME} <{from_address}>"
    message["To"] = to_email

    if text_content:
        message.attach(MIMEText(text_content, "plain", "utf-8"))
    message.attach(MIMEText(html_content, "html", "utf-8"))

    try:
        await aiosmtplib.send(
            message,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            start_tls=settings.SMTP_TLS,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
        )
        logger.info(f"Email gửi thành công đến {to_email}")
        return True
    except Exception as e:
        logger.error(f"Gửi email thất bại đến {to_email}: {e}")
        return False


def _build_email_template(title: str, body_html: str, cta_url: str, cta_text: str) -> str:
    """Tạo HTML email template nhất quán cho NoroFarm."""
    return f"""
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f7f6;font-family:Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0"
               style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#16a34a,#15803d);padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px;">
                🌾 NoroFarm
              </h1>
              <p style="color:#bbf7d0;margin:8px 0 0;font-size:14px;">Nền tảng thông tin nông nghiệp Việt Nam</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#1a2e1a;font-size:22px;margin:0 0 16px;">{title}</h2>
              {body_html}
              <div style="text-align:center;margin:32px 0;">
                <a href="{cta_url}"
                   style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;
                          padding:14px 32px;border-radius:8px;font-size:16px;font-weight:600;">
                  {cta_text}
                </a>
              </div>
              <p style="color:#6b7280;font-size:12px;text-align:center;margin:24px 0 0;">
                Link này sẽ hết hạn sau 24 giờ.<br>
                Nếu bạn không thực hiện hành động này, hãy bỏ qua email này.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="color:#9ca3af;font-size:12px;margin:0;">
                &copy; 2026 NoroFarm. Nền tảng thông tin nông nghiệp.<br>
                <a href="{settings.FRONTEND_URL}" style="color:#16a34a;">norofarm.vn</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""


async def send_password_reset_email(to_email: str, reset_token: str) -> bool:
    """Gửi email đặt lại mật khẩu."""
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
    html = _build_email_template(
        title="Đặt lại mật khẩu NoroFarm",
        body_html="""
            <p style="color:#374151;font-size:15px;line-height:1.6;">
                Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
                Nhấn vào nút bên dưới để đặt lại mật khẩu mới.
            </p>
            <p style="color:#374151;font-size:15px;line-height:1.6;">
                Nếu bạn không yêu cầu điều này, bạn có thể bỏ qua email này.
            </p>
        """,
        cta_url=reset_url,
        cta_text="Đặt lại mật khẩu",
    )
    text = f"Đặt lại mật khẩu NoroFarm của bạn: {reset_url}"
    return await send_email(to_email, "Đặt lại mật khẩu - NoroFarm", html, text)


async def send_email_verification(to_email: str, verify_token: str) -> bool:
    """Gửi email xác minh tài khoản."""
    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={verify_token}"
    html = _build_email_template(
        title="Xác minh tài khoản NoroFarm",
        body_html="""
            <p style="color:#374151;font-size:15px;line-height:1.6;">
                Cảm ơn bạn đã đăng ký NoroFarm! Vui lòng xác minh địa chỉ email
                để kích hoạt đầy đủ tính năng.
            </p>
        """,
        cta_url=verify_url,
        cta_text="Xác minh email",
    )
    text = f"Xác minh tài khoản NoroFarm của bạn: {verify_url}"
    return await send_email(to_email, "Xác minh tài khoản - NoroFarm", html, text)


async def send_price_alert_email(
    to_email: str,
    commodity_name: str,
    current_price: float,
    target_price: float,
    condition: str,
    commodity_id: int
) -> bool:
    """Gửi email thông báo cảnh báo giá nông sản."""
    condition_text = "vượt ngưỡng" if condition == "above" else "giảm xuống mức"
    alert_url = f"{settings.FRONTEND_URL}/commodities/{commodity_id}"
    html = _build_email_template(
        title=f"Cảnh báo giá: {commodity_name}",
        body_html=f"""
            <p style="color:#374151;font-size:15px;line-height:1.6;">
                Xin chào,<br><br>
                Chúng tôi gửi thông báo này vì giá của mặt hàng <strong>{commodity_name}</strong>
                đã {condition_text} <strong>{target_price:,.0f} VNĐ</strong> theo cài đặt của bạn.
            </p>
            <div style="background:#f3f4f6;padding:16px;border-radius:8px;margin:20px 0;text-align:center;">
                <span style="color:#4b5563;font-size:14px;display:block;">Giá hiện tại</span>
                <span style="color:#111827;font-size:24px;font-weight:700;">{current_price:,.0f} VNĐ</span>
            </div>
            <p style="color:#374151;font-size:15px;line-height:1.6;">
                Bạn có thể nhấn vào nút bên dưới để xem biểu đồ lịch sử giá và cập nhật chi tiết.
            </p>
        """,
        cta_url=alert_url,
        cta_text="Xem chi tiết giá",
    )
    text = f"Cảnh báo giá: Giá {commodity_name} đã {condition_text} {target_price:,.0f} VNĐ (Giá hiện tại: {current_price:,.0f} VNĐ). Xem chi tiết tại: {alert_url}"
    return await send_email(to_email, f"Cảnh báo giá: {commodity_name}", html, text)

