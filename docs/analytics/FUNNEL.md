# Thiết kế Phễu Chuyển đổi (Conversion Funnels)

## Mục tiêu
Phễu (Funnel) giúp ta nhìn thấy người dùng đang "Rơi rụng" (Drop-off) ở bước nào trong một quy trình có nhiều bước. Từ đó Product Manager biết phải cải thiện UX/UI ở đâu. 

## 1. Phễu Đăng ký (Signup Funnel)
Một trong những phễu quan trọng nhất để biến Khách vãng lai (Visitor) thành Khách định danh (Registered User).
- **Bước 1:** Bấm nút Đăng nhập / Đăng ký (Event: `auth_modal_opened`).
- **Bước 2:** Chọn phương thức (Vd: Bấm "Tiếp tục với Google").
- **Bước 3:** Hoàn thành điền Form hồ sơ (Tên, Tỉnh thành, Loại tài khoản).
- **Bước 4:** Bấm nút "Hoàn tất" (Event: `user_signup`).
**Mục tiêu Tối ưu:** Rút ngắn quá trình. Nếu tỷ lệ rớt ở Bước 3 quá cao (Vd 60%), nghĩa là Form đang hỏi quá nhiều thông tin không cần thiết. Cần cắt bớt.

## 2. Phễu Cài đặt Cảnh báo Giá (Price Alert Funnel)
Tính năng giữ chân người dùng (Retention Feature). Nếu nông dân cài báo thức giá, họ sẽ mở Web mỗi ngày.
- **Bước 1:** Đang ở trang Bảng giá (Event: `price_viewed`).
- **Bước 2:** Bấm nút Cái Chuông (Event: `alert_modal_opened`).
- **Bước 3:** Nhập Mức giá mong muốn.
- **Bước 4:** Lưu thành công (Event: `price_alert_created`).
**Mục tiêu Tối ưu:** Đảm bảo tỷ lệ chuyển đổi từ Bước 1 sang Bước 4 đạt ít nhất 5%. Nếu thấp hơn, chứng tỏ nút Cái Chuông thiết kế quá mờ nhạt hoặc UX form quá phức tạp.

## Công cụ Thực thi
- Cấu hình trực tiếp trên **PostHog Funnels**. PostHog cho phép vẽ biểu đồ Phễu và bấm vào đoạn "Rơi rụng" để xem lại Video (Session Replay) của chính những người dùng đã thoát ngang, tìm hiểu lý do tại sao.
