# Cross-Site Scripting (XSS)

## Mục tiêu
Ngăn chặn kẻ xấu (Hacker / Người dùng) chèn mã độc JavaScript vào dữ liệu, khiến đoạn mã đó được thực thi trên máy tính của người dùng khác khi họ xem dữ liệu. Đây là lỗi phổ biến nhất trên Frontend.

## Chiến lược phòng thủ

### Tầng Frontend (Next.js)
1. **Tin tưởng React/Next.js:** Mặc định, React sẽ tự động thoát (Escape) mọi chuỗi biến trước khi render ra màn hình. (Ví dụ `{user.name}` an toàn).
2. **Nguy hiểm với `dangerouslySetInnerHTML`:** 
   - Đây là con đường chính dẫn đến XSS. Chỉ sử dụng hàm này để render các Bài viết CMS. 
   - Trước khi nhét HTML vào đây, BẮT BUỘC phải dùng thư viện làm sạch (Sanitization) như `DOMPurify` để lọc bỏ mọi thẻ `<script>`, `onerror`, `onload`.

### Tầng Backend (FastAPI / CMS)
1. **Làm sạch trước khi lưu (Sanitize on Write):**
   - Khi Admin hoặc Người dùng gửi nội dung chứa HTML, Backend phải chạy qua một công cụ lọc XSS (Ví dụ `bleach` trong Python) trước khi lưu vào DB.
2. **Không tin tưởng cả Admin:** Đừng nghĩ Admin là an toàn. Nếu máy Admin bị dính mã độc, hacker có thể tự động viết bài chứa XSS. Mọi HTML đều phải được lọc.

## Content Security Policy (CSP)
- Như đã nhắc trong phần `HEADERS.md`, cấu hình CSP tốt là "tấm khiên thứ 2" chặn đứng XSS ngay cả khi mã độc lọt qua vòng lọc của React và Backend.
