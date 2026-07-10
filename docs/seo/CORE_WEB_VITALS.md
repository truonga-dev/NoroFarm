# Chỉ số Trải nghiệm Người dùng (Core Web Vitals)

## Mục tiêu
Duy trì 3 chỉ số Web Vitals trong ngưỡng Xanh (Passed) theo tiêu chuẩn của Google Search Console. 

## 1. Largest Contentful Paint (LCP) - Tốc độ tải nội dung chính
- **Mục tiêu:** Dưới 2.5 giây.
- Phần tử LCP trên NoroFarm thường là Khối Bảng Giá khổng lồ ở giữa trang, hoặc Hình ảnh Banner to ở trên cùng.
- **Tối ưu:** Cấu hình thuộc tính `priority={true}` cho component `<Image>` của Next.js nếu đó là ảnh Banner. Đảm bảo Bảng giá được Render từ Server (SSR/ISR) chứ không tải từ Client.

## 2. Interaction to Next Paint (INP) - Độ phản hồi tương tác
- **Mục tiêu:** Dưới 200ms. (Thay thế cho FID - First Input Delay).
- INP đo độ trễ từ khi bấm một nút cho đến khi màn hình thay đổi.
- **Tối ưu:** Tránh nhồi nhét quá nhiều Third-party Scripts (Google Analytics, Chat Facebook, Hotjar) chạy cùng một lúc làm ngẽn Luồng Chính (Main Thread) của Trình duyệt. Người dùng bấm nút mà trình duyệt đang mải chạy GA thì sẽ gây ra lag. Sử dụng `@next/third-parties` để trì hoãn (Defer) tải Script rác.

## 3. Cumulative Layout Shift (CLS) - Độ giật/xô lệch giao diện
- **Mục tiêu:** Dưới 0.1.
- CLS xảy ra khi một phần tử bất ngờ chèn vào giữa màn hình làm các khối khác bị đẩy xuống (Thường do Ảnh load chậm xong bung ra, hoặc do Quảng cáo rớt xuống). Điều này gây ức chế vì người dùng định bấm nút thì nút bị trôi đi chỗ khác.
- **Tối ưu:** MỌI HÌNH ẢNH đều phải khai báo sẵn kích thước Rộng/Cao (`width`, `height`). Trình duyệt sẽ đục sẵn một cái lỗ đúng bằng kích thước đó trên giao diện chờ ảnh tải về, không làm xô lệch bất kỳ thứ gì khác.
