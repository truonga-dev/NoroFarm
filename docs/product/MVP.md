# MVP (Sản phẩm Khả thi Tối thiểu)

## Khái niệm
Sản phẩm Khả thi Tối thiểu (Minimum Viable Product - MVP) là phiên bản tinh gọn nhất của NoroFarm, chỉ chứa những tính năng cốt lõi bắt buộc phải có để giải quyết "Nỗi đau" lớn nhất của người dùng, nhằm mục đích ra mắt nhanh nhất có thể (Time-to-market).

## Nguyên tắc Cắt tỉa (Scoping Rule)
Nếu một tính năng "Có thì tốt" (Nice-to-have) nhưng làm chậm tiến độ ra mắt quá 3 ngày -> Cắt bỏ khỏi MVP, đưa vào Roadmap.

## Phạm vi MVP (MVP Scope - Giai đoạn 1)

### 1. Phải Có (Must Have - Giữ lại)
- **Frontend:**
  - Layout Landing Page Responsive chuẩn Mobile.
  - Widget Giá Cà phê Thế giới (Sàn London & NY) hiển thị Real-time.
  - Widget Giá Cà phê Nội địa (Danh sách các tỉnh).
  - Trang đọc Tin tức cơ bản (SSR tốt để SEO).
- **Backend:**
  - Database Supabase Schema (Tin tức, Giá cả).
  - Admin CMS tối giản (Chỉ cần Form nhập giá tay, và Editor viết bài).
  - Cronjob quét API giá sàn ICE (Mỗi 15p).

### 2. Không Cần Thiết (Out of Scope - Bỏ qua ở MVP)
- Hệ thống Đăng nhập / User Profile (Chưa cần, vì bản thân nền tảng lúc đầu là Free, ai xem cũng được).
- Cảnh báo giá (Price Alert) qua SMS/Email.
- Các loại Bảng giá nông sản khác (Tiêu, Điều) -> Tập trung 100% vào Cà phê trước.
- Ứng dụng Di động Native (App Store / Google Play) -> Chỉ dùng Web App (PWA) để SEO.
