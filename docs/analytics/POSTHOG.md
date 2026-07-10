# Phân tích Sản phẩm với PostHog (Product Analytics)

## Mục tiêu
Trong khi GA4 rất tốt để đo lường Traffic, nó lại cực kỳ tồi tệ trong việc hiểu **Người dùng đang bấm vào cái gì bên trong Web**. NoroFarm cần một công cụ Product Analytics chuyên sâu, và PostHog là lựa chọn hoàn hảo (Mã nguồn mở, Hỗ trợ Next.js tuyệt vời).

## Tại sao chọn PostHog?
1. **Auto-capture (Bắt sự kiện tự động):** Khác với GA4 phải code tay từng sự kiện, PostHog tự động ghi lại mọi cú Click chuột, mọi lần thay đổi trang mà không cần viết thêm 1 dòng code nào.
2. **Session Replay (Ghi hình phiên truy cập):** PostHog quay lại một đoạn video (ẩn danh) cho thấy người dùng đã rê chuột thế nào, bấm nhầm vào đâu. Cực kỳ hữu ích để UX Designer tìm ra "Điểm mù" của giao diện.
3. **Feature Flags (Cờ tính năng):** Cho phép NoroFarm bật/tắt một tính năng mới (Ví dụ: Giao diện Bảng giá mới) cho 20% người dùng để Test (A/B Testing) trước khi mở cho 100%.

## Cấu hình Tích hợp
- Tích hợp qua thư viện `posthog-js`.
- Bọc ứng dụng Next.js bằng `<PostHogProvider>`.
- Chặn ghi hình (Masking) các trường dữ liệu nhạy cảm: Tuyệt đối không cho PostHog ghi hình lúc người dùng nhập Mật khẩu, Số điện thoại hoặc Thẻ tín dụng. PostHog hỗ trợ class `.ph-no-capture` để làm mờ các ô Input này.
