# Search Component (Thanh Tìm Kiếm)

## Khi nào sử dụng
Là điểm vào (Entry point) mạnh mẽ nhất. Cho phép người dùng gõ từ khóa để tra cứu giá một mặt hàng nhanh chóng (VD: "Tiêu Chư Sê"). Thường được nhúng vào Header hoặc nằm to nổi bật ở Hero Section.

## Kích thước
- **Header Search (Icon):** Một nút bấm nhỏ góc phải.
- **Global Search (Command Palette - Desktop):** Modal cỡ lớn `max-w-2xl` nằm chính giữa màn hình.
- **Mobile Search:** Mở ra thanh Search toàn màn hình (Full-screen overlay) có bàn phím ảo đẩy lên.

## Typography
- **Input Text:** `text-lg` hoặc `text-base` rõ ràng, bự hơn text bình thường.
- **Phím tắt (Shortcut hint):** Nằm gọn bên trong ô search, chữ nhỏ `text-xs text-muted-foreground` (Ví dụ: `⌘K` hoặc `Ctrl K`). 
- **Kết quả (Results):** `text-sm font-medium`.

## Radius
- Thanh gõ: Bo tròn mạnh `rounded-full` (nếu đứng độc lập) hoặc `rounded-lg` (nếu dạng bảng Modal Command Palette).

## Shadow
- Command Palette khi mở lên có Shadow sâu `shadow-2xl` đè lên nền mờ tối (`backdrop-blur`).

## Padding & Icon
- Biểu tượng Kính lúp (Search Icon) `size-4` hoặc `size-5` nằm ở mép trái (`pl-3`).
- Padding cực lớn cho ô gõ để thoải mái.

## Trạng thái & Tính năng (States)
- **Trạng thái Tĩnh (Trigger):** Ô nhập giả (Chỉ là một Button mô phỏng thẻ Input). Khi bấm vào, mới thật sự mở Search.
- **Focus:** 
  - Mở ra giao diện Command Palette (Kiểu macOS Spotlight hoặc Raycast). 
  - Ngay lập tức hiển thị lịch sử tìm kiếm gần đây (Recent Searches) hoặc "Từ khóa Hot" mà chưa cần gõ chữ nào.
- **Gõ chữ (Typing):** Icon bên phải biến thành nút `[X]` (Nút xóa siêu tốc). Xuất hiện Spinner quay đều góc phải báo hiệu đang tìm.
- **Kết quả (Dropdown Results):** Danh sách xổ xuống. Hover vào một dòng nền đổi xám `bg-slate-100`. Hỗ trợ dùng phím Mũi tên lên xuống để lướt qua kết quả.

## Ánh sáng (Modes)
- Kế thừa các token nền, viền và chữ như Modal Component (Nền Trắng/Xám Đen, viền mỏng 1px).
- Highlight (bôi đậm) đoạn chữ khớp với từ khóa tìm kiếm (Ví dụ Tìm "Cà", kết quả sẽ in đậm chữ "**Cà** phê"). Màu bôi đậm là màu Primary.

## Accessibility
- Gắn thẻ `<form role="search">`. Input có `aria-label="Tìm kiếm nông sản, bài viết..."`.
- Hỗ trợ Phím tắt toàn cầu (Global Hotkey): Nhấn `⌘ + K` (hoặc `Ctrl + K`) ở bất kỳ đâu trên website sẽ tự động mở hộp Tìm kiếm, con trỏ nhấp nháy ngay vào ô Text.
