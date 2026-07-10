# Bảo mật Sao lưu (Backup Security)

## Mục tiêu
Dữ liệu sao lưu (Backup) là điểm yếu chết người. Kẻ tấn công có thể không hack được hệ thống đang chạy (Production), nhưng nếu chúng tìm thấy File Backup SQL nằm tơ hơ trên Server, chúng sẽ bê nguyên Data bỏ trốn.

## Quy tắc Sao lưu An toàn
1. **Lưu trữ ngoài (Off-site Storage):** 
   - File Backup không được phép nằm trên cùng một ổ cứng hay cùng một Server với Database đang chạy. Bắt buộc bắn file sang Cloud Storage dự phòng (S3, AWS Glacier, Cloudflare R2).
2. **Mã hóa khi nghỉ (Encryption at Rest):** 
   - File nén `.sql.gz` trước khi tải lên Bucket dự phòng phải được mã hóa thêm một lớp mật khẩu AES-256 (Vd: `gpg -c`). Ngay cả khi hacker chiếm được Bucket, file Database vẫn là cục gạch.
3. **Quyền truy cập hạn chế (IAM):** 
   - Script tự động Backup chỉ có quyền GHI (Write-only / PutObject). Không được cấp quyền XÓA (Delete). Để phòng ngừa mã độc Ransomware xâm nhập Server, ăn cắp quyền của script rồi ra lệnh Xóa toàn bộ file Backup trên Cloud.
4. **Luân chuyển & Dọn dẹp (Rotation/Retention):** 
   - Thiết lập tự động xóa file backup cũ hơn 30 ngày để chống lộ lọt dữ liệu quá hạn, đồng thời tiết kiệm tiền lưu trữ.
