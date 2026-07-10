# Headers Bảo mật (Security Headers)

## Mục tiêu
Bảo vệ Frontend (Next.js) bằng cách khai báo các quy tắc xử lý khắt khe cho Trình duyệt (Browser) thông qua HTTP Response Headers. 

## Các Header Bắt buộc
NoroFarm (Thông qua `next.config.js`) phải cấu hình các Header sau:

1. **Content-Security-Policy (CSP):**
   - Header quan trọng nhất để chống XSS. Nó báo cho trình duyệt biết Website chỉ được phép chạy JS tải từ tên miền của chính mình, chặn chạy JS nội tuyến (Inline Script) hay tải Script từ nguồn lạ.
   - Ví dụ: `Content-Security-Policy: default-src 'self'; img-src 'self' https://supabase.co;`

2. **X-Frame-Options:**
   - Giá trị: `DENY` hoặc `SAMEORIGIN`.
   - Ngăn chặn kẻ xấu nhúng NoroFarm vào iframe trên website của họ (Tấn công Clickjacking).

3. **X-Content-Type-Options:**
   - Giá trị: `nosniff`.
   - Ngăn trình duyệt tự ý đoán định dạng file (Vd đoán 1 file ảnh thành file JS và chạy nó).

4. **Strict-Transport-Security (HSTS):**
   - Giá trị: `max-age=31536000; includeSubDomains`.
   - Ép buộc trình duyệt chỉ được dùng HTTPS khi truy cập vào tên miền, không được phép lùi xuống HTTP (Phòng chống tấn công Man-in-the-Middle).

5. **Referrer-Policy:**
   - Giá trị: `strict-origin-when-cross-origin`.
   - Tránh làm lộ URL nhạy cảm của NoroFarm sang website khác khi người dùng bấm vào một external link.
