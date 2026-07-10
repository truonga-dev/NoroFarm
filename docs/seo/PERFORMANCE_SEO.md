# Hiệu năng và SEO (Performance SEO)

## Sự liên quan
Từ năm 2021, Google chính thức coi **Tốc độ Tải trang (Page Speed)** là một Tiêu chí Xếp hạng (Ranking Factor). Nếu NoroFarm nội dung tốt nhưng Load mất 5 giây, Google sẽ đánh tụt hạng và đẩy trang của đối thủ (Load 1 giây) lên thay thế.

## Cấu hình Kiến trúc Next.js cho SEO
1. **SSG (Static Site Generation):** Đối với các trang Giới thiệu, Chính sách, Bắt buộc dùng SSG. HTML được tạo sẵn lúc Build, tốc độ tải cực nhanh vì không cần qua Database.
2. **ISR (Incremental Static Regeneration):** Đây là "Vũ khí bí mật" của NoroFarm. Trang Bảng giá thay đổi mỗi ngày, nếu dùng SSG thì số liệu bị cũ. Nếu dùng SSR (Server-side) thì tải chậm. 
   - Giải pháp ISR: Cache HTML tĩnh trong 60 giây. Cứ mỗi 60 giây có người vào, Next.js sẽ tự ngầm tạo lại HTML mới và cập nhật cho người tiếp theo. Vừa đạt tốc độ của SSG, vừa có dữ liệu mới.

## Giảm thiểu Javascript (JS Payload)
- Googlebot cực kỳ ghét trang web nặng JavaScript. Nếu mất quá nhiều CPU để chạy JS mới ra được giao diện, Bọ sẽ bỏ đi.
- **Quy tắc:** Mọi dữ liệu (Bảng giá, Tiêu đề, Text) phải nằm sẵn trong HTML nguyên bản (Raw HTML). Không dùng React `useEffect` để gọi API lấy Text rồi mới in ra, vì lúc đó Bọ đã quét xong và thấy trang trắng bóc.

## Tối ưu CSS
- Taildwind CSS là lựa chọn hoàn hảo. Khác với Bootstrap, Tailwind dùng công cụ PurgeCSS để xóa bỏ 100% các dòng code CSS không được sử dụng. File CSS cuối cùng tải xuống trình duyệt thường bé hơn 10KB.
