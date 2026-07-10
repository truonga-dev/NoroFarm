# Danh sách Kiểm tra Bảo mật (Security Checklist)

Tài liệu này được DevOps và QA (Kỹ sư kiểm thử) sử dụng để Tích (Check) trước mỗi lần tung Phiên bản mới (Release/Deploy) lên Môi trường Production.

## 1. Authentication & Authorization
- [ ] Mật khẩu Database và Cache đã được đặt độ khó cao?
- [ ] Không có Endpoint Admin nào trả về 200 OK nếu gọi không có JWT?
- [ ] Đăng nhập thất bại quá 5 lần sẽ bị Rate Limit/Block IP?
- [ ] JWT Secret dài ít nhất 64 ký tự và không dùng Secret cũ của Staging?
- [ ] Row Level Security (RLS) trên Supabase đã được `ENABLE` cho tất cả các Bảng mới tạo?

## 2. API & Data Security
- [ ] Pydantic Schemas đã được dùng để lọc dữ liệu Đầu vào và Đầu ra?
- [ ] CORS đã đổi từ `*` thành các Domain chính thức?
- [ ] Mọi API phân trang đều bị giới hạn `limit <= 100`?
- [ ] Frontend không hiển thị Raw HTML nếu chưa qua `DOMPurify`?
- [ ] Đã cấu hình `Content-Security-Policy` trong Next.js?

## 3. Infrastructure & DevOps
- [ ] Kiểm tra toàn bộ mã nguồn không có API Keys, Passwords hardcode?
- [ ] Môi trường Production chạy trên 1 Server/Database tách biệt?
- [ ] Supabase Service Role Key KHÔNG BỊ lộ ra Client-side?
- [ ] Chế độ Debug Mode (`DEBUG=True`) của FastAPI và Next.js đã được Đóng (`False`)?
- [ ] Backup tự động hàng ngày đã được kích hoạt và gửi sang S3 Bucket riêng biệt?

## 4. Dependencies
- [ ] Đã chạy lệnh `npm audit` để kiểm tra thư viện Node.js có lỗ hổng không?
- [ ] Đã chạy lệnh `pip-audit` hoặc xem báo cáo Dependabot cho Python?
- [ ] Image Docker được Build từ Alpine/Slim, không chạy dưới quyền `root` bên trong Container?

*Nếu có bất kỳ ô nào bị đánh dấu [X] Đỏ, không được phép Release phiên bản.*
