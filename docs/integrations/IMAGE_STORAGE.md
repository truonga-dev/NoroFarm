# Tích hợp Lưu trữ Hình ảnh (Image & Media Storage)

## Mục tiêu
Website tin tức sẽ tạo ra hàng vạn file ảnh sau vài năm. Nếu lưu trực tiếp ảnh vào thư mục code (`public/` hoặc `/var/www/`) trên VPS, VPS sẽ sớm cạn kiệt ổ cứng, và khi Web sập, mất VPS là mất sạch Ảnh. Do đó BẮT BUỘC phải lưu ảnh lên Đám mây lưu trữ tĩnh (Object Storage).

## Nhà cung cấp đề xuất
- **Supabase Storage:** Khuyên dùng. Do NoroFarm đã dùng Database Supabase, nên dùng luôn Storage của họ cho đồng bộ. Chạy trên hạ tầng S3.
- **AWS S3:** Tiêu chuẩn công nghiệp cao nhất.
- **Cloudflare R2:** Hoàn toàn miễn phí chi phí Băng thông thoát (Egress Fee), một lựa chọn xuất sắc để tiết kiệm chi phí.

## Quy trình Tải ảnh (Upload Flow)
1. **Direct Upload (Khuyến nghị):**
   - Trình duyệt (Browser) gọi API của Backend FastAPI xin phép: "Tôi muốn upload ảnh `avatar.jpg`".
   - Backend kiểm tra Token, nếu hợp lệ, Backend lấy từ S3 một tờ giấy thông hành tên là **Presigned URL** đưa cho Browser.
   - Browser cầm tờ URL này, bơm thẳng file `avatar.jpg` lên S3 mà không cần chạy xuyên qua con Server FastAPI nữa. (Cách này giúp FastAPI không bị nghẽn RAM khi có 100 người cùng upload ảnh 5MB).
2. **Backend Upload:** 
   - Trình duyệt gửi Ảnh cho FastAPI -> FastAPI cầm ảnh gửi lên S3. (Chậm, nặng RAM).

## Tối ưu Hiển thị ảnh (Image Optimization)
- Bất kể ảnh gốc nằm trên S3 dung lượng lớn thế nào (Ví dụ 5MB, JPG), khi Frontend Next.js gọi ảnh ra hiển thị, Next.js sẽ BẮT BUỘC phải dùng component `<Image>` (`next/image`).
- Server của Vercel sẽ "chặn" tấm ảnh 5MB này lại, nén nó xuống chuẩn WebP siêu nhẹ (cỡ 100KB), Resize cho đúng kích thước Điện thoại, rồi mới trả về cho Người dùng. 
- Giúp điểm SEO tuyệt đối.
