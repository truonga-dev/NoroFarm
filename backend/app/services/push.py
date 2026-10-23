import json
import logging
from pywebpush import webpush, WebPushException
from app.core.config import settings
from app.models.notification import WebPushSubscription

logger = logging.getLogger("norofarm")

class PushService:
    """Service gửi thông báo đẩy (Web Push Notifications) cho trình duyệt"""

    def __init__(self):
        self.public_key = settings.VAPID_PUBLIC_KEY
        self.private_key = settings.VAPID_PRIVATE_KEY
        self.claim_email = settings.VAPID_CLAIM_EMAIL

    def send_push_notification(self, subscription: WebPushSubscription, title: str, message: str, link: str = None) -> bool:
        """
        Gửi thông báo đẩy đến một subscription cụ thể.
        Trả về True nếu thành công, False nếu thất bại.
        """
        if not self.public_key or not self.private_key:
            logger.warning("VAPID Keys chưa được cấu hình đầy đủ. Bỏ qua gửi Web Push.")
            return False

        subscription_info = {
            "endpoint": subscription.endpoint,
            "keys": {
                "p256dh": subscription.p256dh,
                "auth": subscription.auth
            }
        }

        payload = {
            "notification": {
                "title": title,
                "body": message,
                "icon": "/logo.png",
                "badge": "/badge.png",
                "data": {
                    "url": link or "/"
                }
            }
        }

        try:
            webpush(
                subscription_info=subscription_info,
                data=json.dumps(payload),
                vapid_private_key=self.private_key,
                vapid_claims={"sub": self.claim_email}
            )
            logger.info(f"Đã gửi Web Push thành công tới user_id: {subscription.user_id}")
            return True
        except WebPushException as ex:
            logger.error(f"Lỗi gửi Web Push (WebPushException): {ex}")
            # Trả về mã lỗi phản hồi để bên gọi có thể xử lý xóa subscription hết hạn
            if ex.response is not None and ex.response.status_code == 410:
                return "expired"
            return False
        except Exception as e:
            logger.error(f"Lỗi không xác định khi gửi Web Push: {e}")
            return False

push_service = PushService()
