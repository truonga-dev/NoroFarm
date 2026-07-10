# Trải nghiệm Tìm kiếm (Search UI)

Chức năng tìm kiếm trong hệ thống NoroFarm phải nhanh, bao quát và tạo cảm giác "chuyên nghiệp" (Pro) như tính năng Spotlight của Apple hay Command Palette của Linear/Notion.

## 1. Điểm kích hoạt (Trigger)
- Nút tìm kiếm trên Header: Không phải một thanh nhập liệu dài, mà là một thanh giả (Mock input) có icon Lúp và text "Tìm kiếm giá cả, tin tức...". Phía bên phải của thanh này hiển thị phím tắt `⌘K` hoặc `Ctrl+K`.

## 2. Command Palette (Cửa sổ Tìm kiếm Trung tâm)
Khi người dùng click hoặc gõ phím tắt, một Modal lớn (Command Palette) xuất hiện giữa màn hình.
- **Background:** Làm mờ (backdrop-blur) phần nền website phía sau để tạo sự tập trung tuyệt đối.
- **Thanh Nhập (Input):** Cực kỳ lớn (`h-14` hoặc `h-16`), font to `18px`, không viền (borderless), chỉ có đường kẻ ngang mỏng ở dưới. Trạng thái Auto-focus.
- **Khu vực Kết quả (Results Area):**
  - Trạng thái chưa gõ (Empty): Hiển thị "Tìm kiếm gần đây" hoặc "Xu hướng tìm kiếm" (Top Trending - Ví dụ: Giá Cà Phê Đắk Lắk).
  - Trạng thái đang gõ: Fetch dữ liệu real-time. Kết quả được phân nhóm rõ ràng (Group):
    - Nhóm [Giá Nông Sản] (Hiển thị Giá hiện tại ngay trong kết quả tìm kiếm).
    - Nhóm [Tin tức] (Tiêu đề tin tức).
    - Nhóm [Chức năng] (Đến trang Thời tiết, Đến trang Liên hệ).

## 3. Tương tác (UX/Keyboard Navigation)
- Người dùng có thể dùng phím Mũi tên (Lên/Xuống) để chọn kết quả. Kết quả đang chọn được highlight bằng nền xám nhạt (`bg-accent`). Bấm Enter để đi tới trang đó.
- Bấm ESC để đóng cửa sổ tìm kiếm.
