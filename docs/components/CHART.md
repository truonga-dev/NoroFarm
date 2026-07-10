# Chart Component (Biểu đồ)

## Khi nào sử dụng
Đây là trái tim của NoroFarm (Trang Market Trend). Dùng để trực quan hóa lịch sử và xu hướng biến động giá của nông sản (Cà phê, Tiêu). Dùng để so sánh tỷ lệ giữa các đại lượng (Khối lượng xuất khẩu, Diện tích trồng).

## Cấu trúc thành phần (Dựa trên Recharts)
NoroFarm Chart sử dụng phong cách thiết kế tối giản:
- **Khung (Container):** Chiều cao cố định (`h-[300px]` hoặc `h-[400px]`), rộng 100%. Nằm trong một Card.
- **Trục (Axes - X/Y):** Ẩn hoàn toàn đường kẻ trục đứng (Y axis lines) và trục ngang (X axis lines) bằng nét đứt mờ (Dotted/Dashed lines màu `border` cực nhạt) hoặc ẩn hẳn để giao diện sạch.
- **Text Trục (Tick marks):** Font siêu nhỏ `text-xs text-muted-foreground`. Hạn chế số lượng Tick, không hiển thị dày đặc.
- **Đường đồ thị (Lines):** 
  - Nét cong mềm mại (`monotone` hoặc `basis`), tuyệt đối KHÔNG dùng đường gập khúc gấp cạnh (sharp/linear) trừ khi dữ liệu rời rạc đặc biệt.
  - Nét dày `2px` hoặc `3px` (`strokeWidth`).
  - Màu đường kẻ: Primary (Xanh ngọc).
- **Phủ Gradient (Area Fill):** Đổ màu gradient nhạt từ đường Line xuống đáy trục X (Opacity từ `0.2 -> 0`), màu trùng với Line, tạo độ bám (Weight) cho biểu đồ.

## Trạng thái Tương tác (Interactive States)
- **Hover:**
  - Không có Hover thì biểu đồ nhìn tĩnh.
  - Có Hover: Xuất hiện vạch gióng dọc (Vertical Crosshair) bám sát theo chuyển động của chuột.
- **Tooltip:**
  - Một hộp thoại (Card siêu nhỏ) gắn liền với điểm chạm trên trục X.
  - Hiển thị Text to, in đậm (Ví dụ: Giá Đắk Lắk ngày 15/07 là `110,000 VND`).
  - Có Shadow lớn `shadow-xl`, bo góc `rounded-lg` giống hệt Tooltip Component chuẩn.

## Ánh sáng (Modes) & Màu Semantic
- Màu đường biểu đồ không bị gò bó vào Primary, mà dùng Semantic theo loại biểu đồ (Vd: Màu Cà Phê, Màu Hồ Tiêu, Màu Gạo). Cần khai báo các biến `--chart-1`, `--chart-2` trong `tailwind.config` để Dark mode tự điều chỉnh sáng lên.
- **Dark Mode:** Đảo ngược màu nền Tooltip, chữ. Đường Grid (Lưới trục) chuyển sang màu `slate-800`.

## Loading (Skeleton) & Empty
- Đang tải: Khung biểu đồ nhấp nháy, hiện một đường kẻ zig-zag xám (Skeleton Line) lướt qua.
- Không có data: Giống Empty State (Icon lớn, chữ "Chưa có dữ liệu").

## Accessibility
- Đồ thị quá phức tạp đối với người khiếm thị. Cần một nút nhỏ "Hiển thị Dữ Liệu Bảng" (View as Table) để Screen Reader có thể đọc trực tiếp các hàng/cột số liệu dạng Text.
