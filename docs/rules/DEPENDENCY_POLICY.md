# Quy tắc Quản lý Thư viện (Dependency Policy)

## Lệnh Cấm Tuyệt đối
AI Agent **TUYỆT ĐỐI KHÔNG ĐƯỢC PHÉP** tự ý cài đặt thêm thư viện mới (Sử dụng `npm install`, `yarn add`, `pip install`) mà chưa hỏi ý kiến người dùng.

## 1. Nỗi đau của Dependency Hell
Mỗi một gói thư viện cài thêm vào dự án sẽ mang theo:
- Rủi ro Bảo mật (Vulnerability).
- Giảm hiệu năng tốc độ tải trang (Bloat).
- Xung đột phiên bản (Dependency Conflicts).

## 2. Tiêu chí Đánh giá Thư viện Mới
Khi muốn đề xuất thêm 1 thư viện mới vào dự án, AI phải chứng minh được:
1. Nó giải quyết được bài toán mà Code tay mất quá nhiều thời gian (> 2 ngày).
2. Nó phổ biến (Trên 100k lượt tải/tuần, số lượng Sao GitHub cao).
3. Nó đang được bảo trì tích cực (Commit cuối cùng không quá 6 tháng).
4. Kích thước gói tin (Bundle size) cực nhẹ.

## 3. Quản lý Phiên bản (Lock Files)
- Trên Frontend: BẮT BUỘC sử dụng tệp `package-lock.json` hoặc `pnpm-lock.yaml`. Khi người dùng bảo AI "Chạy project đi", AI chỉ được dùng lệnh `npm ci` (Cài đặt đúng bản lock), CẤM dùng `npm install` (Vì nó có thể tải bản mới nhất làm sập code cũ).
- Trên Backend: BẮT BUỘC sử dụng `requirements.txt` với phiên bản được ghim cứng (Vd: `fastapi==0.110.0`) thay vì `fastapi>=0.100`. Hoặc dùng công cụ hiện đại như `Poetry` (`poetry.lock`).
