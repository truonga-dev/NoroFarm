# Tích hợp Google Analytics 4 (GA4)

## Mục tiêu
GA4 là công cụ "Bắt buộc phải có" (Industry Standard) cho việc theo dõi Lưu lượng truy cập (Traffic) tổng thể, Phân tích nhân khẩu học (Demographics) và Nguồn truy cập (Acquisition Sources).

## Vai trò của GA4 trên NoroFarm
- **Theo dõi Nguồn khách (Acquisition):** Biết được khách hàng đến từ Google Search (SEO), từ Facebook (Social), hay Gõ trực tiếp tên miền.
- **Theo dõi Thiết bị (Devices):** Đánh giá tỷ lệ Mobile vs Desktop. (Với nông dân, tỷ lệ Mobile có thể lên tới 90%, từ đó định hướng UI phải chuẩn Mobile-first).
- **Trang phổ biến (Pages/Screens):** Tìm ra Bài báo nào hoặc Tỉnh thành nào được xem Bảng giá nhiều nhất.

## Tiêu chuẩn Kỹ thuật (Technical Setup)
- **Tích hợp Next.js:** KHÔNG chèn script GA4 một cách ngây thơ vào thẻ `<head>` vì sẽ làm hỏng điểm Core Web Vitals (INP/LCP). BẮT BUỘC dùng thẻ `<GoogleAnalytics gaId="G-XXXXXX" />` từ gói `@next/third-parties/google` của Vercel. Gói này sử dụng cơ chế Partytown/WebWorker để chạy mã theo dõi ở một luồng riêng biệt, không làm lag giao diện chính.
- **Cookie Consent:** Tại EU (GDPR) hoặc theo chuẩn tương lai, trang web phải có Popup hỏi ý kiến người dùng trước khi ghi Cookie của GA4.
