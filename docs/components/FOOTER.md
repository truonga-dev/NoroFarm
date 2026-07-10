# Footer Component (Chân trang)

## Khi nào sử dụng
Nằm dưới cùng của tất cả các trang. Dùng để chứa lượng lớn liên kết phụ (Secondary Links), thông tin liên hệ, mạng xã hội, bản quyền, và các trang chính sách (Terms, Privacy) - những thứ bắt buộc phải có nhưng không được chiếm diện tích chú ý ở nửa trên website.

## Kích thước
- Chiều cao linh hoạt dựa trên số lượng cột Link. Thường khoảng `300-400px` trên Desktop. Chiều rộng 100%.

## Typography
- **Cột Tiêu đề (Column Title):** `text-sm font-semibold text-foreground`.
- **Link (Item):** `text-sm text-muted-foreground` (14px). Khoảng cách dòng thưa (`leading-loose`).
- **Copyright:** `text-xs text-muted-foreground`.

## Radius
- Không bo góc. (Trừ khi thiết kế Footer dạng nổi bật như một khối màu bao trọn góc dưới).

## Shadow
- Không Shadow.
- Phân cách với phần nội dung bên trên bằng đường viền gạch ngang cực mảnh (`border-t border-border`) và một khoảng padding cực lớn.

## Padding
- Rất rộng. Padding Top/Bottom: `py-16` hoặc `py-24`.
- Grid gap lớn (Khoảng cách giữa các cột): `gap-8` hoặc `gap-12`.

## Layout & Trạng thái
- **Desktop:** CSS Grid `grid-cols-4` hoặc `grid-cols-5`. 
  - Cột đầu tiên to nhất chứa Logo và mô tả ngắn. 
  - Các cột sau chứa Link.
- **Mobile:** Chuyển về xếp dọc `flex-col`, nội dung căn trái.
- **Hover Links:** Giống Header. Chữ xám (`text-muted-foreground`) sáng lên thành chữ đen (`text-foreground`). Có thể thêm hiệu ứng gạch chân mờ (`underline-offset-4`).

## Ánh sáng (Modes)
- **Light Mode:** Có thể dùng màu nền hơi tối hơn Body một chút (Ví dụ: Trắng ngà `bg-slate-50`) để tạo mảng miếng khối cho trang, hoặc giữ nguyên Trắng tinh `bg-white`.
- **Dark Mode:** Đen tuyền `bg-[#000]`, phân tách với màu nền xám tối bên trên.

## Accessibility
- Sử dụng semantic tag `<footer>`.
- Các khối danh sách link sử dụng `<ul>` và `<li>`. Link trỏ ra ngoài hệ thống (External) cần có thuộc tính `rel="noopener noreferrer"`.
- Form Đăng ký nhận tin (Newsletter) ở footer (nếu có) phải đầy đủ `label` và `button submit`.
