# Tích hợp Phân tích Dữ liệu (Analytics & Tracking)

## Mục tiêu
Thu thập hành vi người dùng, theo dõi số lượt truy cập, nguồn gốc người dùng (Từ Google hay Facebook), và hiểu rõ nội dung nào (Bài báo hay Bảng giá) đang được quan tâm nhất để định hướng kinh doanh.

## Nhà cung cấp đề xuất
1. **Google Analytics 4 (GA4):** Tiêu chuẩn công nghiệp, miễn phí, tích hợp sâu vào hệ sinh thái Google (Google Ads, Search Console).
2. **Vercel Web Analytics:** Khuyên dùng cho trang Next.js. Không dùng Cookie (Tuân thủ GDPR), siêu nhẹ, báo cáo Real-time cực kỳ trực quan ngay trên Dashboard Vercel.
3. **PostHog / Mixpanel:** Dùng để theo dõi Sự kiện Phễu (Event Funnels) cực kỳ chi tiết (Ví dụ: Bao nhiêu người bấm vào nút Đăng ký, nhưng rớt ở bước Nhập OTP).

## Chiến lược Cài đặt
- **Gắn Tag (Tagging):** Mọi công cụ Analytics đều cung cấp 1 đoạn Snippet JavaScript (Mã theo dõi).
- **Tối ưu Web Vitals:** Tuyệt đối KHÔNG bỏ mã GA4 thẳng vào `<head>` bằng thẻ `<script>` bình thường. Phải sử dụng component `<GoogleAnalytics>` từ gói `@next/third-parties/google` của Next.js. Gói này sẽ đẩy việc load script xuống ưu tiên thấp nhất (Web Worker), không làm chậm tốc độ render giao diện chính.

## Các Sự kiện Quan trọng (Custom Events)
Ngoài việc đếm số người xem trang (Pageviews), Frontend cần chủ động bắn (Trigger) các sự kiện tùy chỉnh (Events) về Server phân tích:
- `user_signup`: Đăng ký thành công.
- `search_query`: Người dùng gõ tìm kiếm từ gì.
- `price_alert_created`: Người dùng cài đặt chuông cảnh báo giá.
- `ad_clicked`: Người dùng bấm vào Quảng cáo.
