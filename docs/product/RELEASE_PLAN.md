# Kế hoạch Phát hành (Release Plan)

## Mục tiêu
Quy định cách thức Đưa mã nguồn mới lên Môi trường Thực tế (Production) mà không làm gián đoạn người dùng đang xem giá, đảm bảo an toàn tối đa.

## Chiến lược Phát hành
1. **Continuous Deployment (CI/CD):**
   - Mọi bản cập nhật nhỏ (Sửa lỗi chính tả, đổi màu nút) được tự động Đẩy thẳng (Push) lên Vercel/Railway thông qua GitHub Actions ngay sau khi Merge Code.
   - Tốc độ phát hành: 5-10 bản/ngày.
2. **Feature Releases (Tính năng lớn):**
   - Ví dụ ra mắt "Chức năng Đăng nhập". KHÔNG đẩy trực tiếp vào ngày thường.
   - Thời điểm vàng phát hành: **Thứ 7 hoặc Chủ Nhật** (Lúc sàn giao dịch đóng cửa, Traffic thấp nhất trong tuần). Nếu xảy ra lỗi sập web, Dev có thời gian sửa mà không làm ảnh hưởng đến việc coi giá của nông dân.
3. **Phát hành Nhỏ giọt (Canary / Phased Rollout):**
   - Nếu đổi giao diện Bảng giá mới 100%, không mở cho toàn bộ người dùng ngay.
   - Mở trước cho 10% Traffic (Cấu hình trên Vercel Edge). Quan sát Error Logs trong 1 tiếng. Nếu không có lỗi, mở lên 50%, rồi 100%.

## Quy trình Hậu Phát hành (Post-Release)
- Dev phải ngồi trực (Monitor) trên trang Sentry (Lỗi) và GA4 (Traffic) trong ít nhất 30 phút sau khi bấm Deploy.
- Nếu thấy Spike (Cột lỗi dựng đứng lên), BẮT BUỘC bấm nút **Rollback** (Quay về bản cũ) trên Vercel ngay lập tức, không cố ngồi sửa lỗi trên Production.
