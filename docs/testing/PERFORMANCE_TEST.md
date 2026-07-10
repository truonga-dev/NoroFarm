# Kiểm thử Hiệu năng (Performance Test)

## Mục tiêu
Đảm bảo tốc độ tải trang cực nhanh của NoroFarm, giữ chân người dùng và thỏa mãn yêu cầu tối đa của Bộ máy tìm kiếm (Google SEO). Mục tiêu là đạt **90+ điểm Lighthouse** trên cả Mobile và Desktop.

## Core Web Vitals (Chỉ số cốt lõi)
Hiệu năng Frontend được đo bằng 3 chỉ số chính của Google:
1. **LCP (Largest Contentful Paint):** Thời gian tải phần tử nội dung lớn nhất (Ảnh nền hoặc Khối text lớn). **Mục tiêu: < 2.5 giây**.
2. **INP (Interaction to Next Paint):** Độ trễ từ khi bấm nút đến khi trang web phản hồi giao diện. **Mục tiêu: < 200ms**.
3. **CLS (Cumulative Layout Shift):** Độ xô lệch giao diện (Ví dụ: Web đang đọc tự nhiên nhảy ảnh xuống dưới). **Mục tiêu: < 0.1**.

## Công cụ Kiểm thử
- **Google Lighthouse:** Có sẵn trong Chrome DevTools. Dùng để đo thủ công trong lúc code.
- **Vercel Analytics & Speed Insights:** Tích hợp trực tiếp trên Dashboard của Vercel, theo dõi điểm hiệu năng của *Người dùng thật* (RUM - Real User Monitoring) đang truy cập trên toàn cầu.
- **PageSpeed Insights API:** Tự động chạy mỗi khi có Pull Request để báo cáo xem Code mới có làm điểm SEO/Speed bị tụt đi hay không (Performance Regression).

## Tối ưu (Optimization Techniques)
- **Hình ảnh:** LUÔN SỬ DỤNG Next/Image để tự động convert sang WebP và tối ưu kích thước. Không bao giờ dùng thẻ `<img>` thuần.
- **Lazy Load:** Khối nội dung nằm dưới cùng (Below the fold) phải được Lazy Load, không tải ngay lập tức lúc mới vào web.
- **Giảm bundle size:** Theo dõi kích cỡ các thư viện JS. Thay thế các thư viện quá nặng (Ví dụ: Chuyển từ `moment.js` sang `date-fns`).
- **Caching:** Kiểm tra xem trang có được Next.js Pre-render (SSG) hoặc CDN Cache chưa. Thời gian phản hồi của TTFB (Time to First Byte) phải **< 200ms**.
