# Bảo mật Môi trường (Environment Security)

## Mục tiêu
Đảm bảo mã nguồn (Source Code) và cấu hình vận hành (Infrastructure) không làm lộ lọt thông tin nhạy cảm. Quản lý sự cách ly giữa các môi trường Local, Staging và Production.

## Cách ly Môi trường (Environment Isolation)
- **Tách biệt Database:** Môi trường Staging và Production BẮT BUỘC dùng 2 Database độc lập (2 Project Supabase riêng biệt).
- **Dữ liệu giả lập (Mock Data):** Database Staging/Local chỉ được chứa dữ liệu giả mạo (Seed Data) hoặc dữ liệu đã được ẩn danh (Anonymized). Không bao giờ Import toàn bộ Database Production chứa Số điện thoại và Email thật của Khách hàng xuống Local để lập trình viên test.

## Quản lý Git & Code Repository
- **Loại trừ File nhạy cảm:** Bắt buộc duy trì file `.gitignore` chứa `.env`, `.env.local`, thư mục `__pycache__`, `.next`.
- **Tự động Quét (Pre-commit Hook):** Sử dụng công cụ quét rò rỉ mã bí mật (Secret Scanner như `gitleaks` hoặc `trufflehog`) tự động chạy mỗi khi Developer gõ lệnh `git commit`. Nếu phát hiện API Key bị hardcode, từ chối Commit.
- **Bảo mật Branch:** Branch `main` và `production` phải bật chế độ Bảo vệ (Branch Protection Rules trên GitHub). Chỉ cho phép gộp code (Merge) qua Pull Request và bắt buộc phải có ít nhất 1 người Review code (Phòng chống Developer cài cắm mã độc - Backdoor).
