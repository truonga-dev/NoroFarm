# Thiết kế: Trang Giá Cà Phê

## 1. Mục tiêu
Cung cấp cái nhìn chuyên sâu và nhanh nhất về giá cà phê hôm nay tại các vùng miền. Giao diện cần giống như một Dashboard tài chính thu nhỏ, đáng tin cậy và dày đặc dữ liệu nhưng không rối mắt.

## 2. Bố cục (Layout)
- **Header Section:** Tiêu đề "Giá Cà Phê Hôm Nay", nút chọn ngày (Date Picker), và thông báo thời gian cập nhật lần cuối.
- **Summary Cards (Thống kê nhanh):** 3-4 thẻ nhỏ nằm ngang trên cùng hiển thị: Giá trung bình, Mức tăng/giảm, Vùng giá cao nhất.
- **Main Layout (Grid):**
  - Cột trái (chiếm 2/3): Bảng giá cà phê chi tiết theo tỉnh/huyện.
  - Cột phải (chiếm 1/3): Biểu đồ đường (Line chart) nhỏ biểu diễn xu hướng giá 7 ngày qua.
- **Bottom Section:** Lịch sử giá hoặc Phân tích thị trường liên quan.

## 3. Spacing & Grid
- **Container:** `max-w-7xl` với padding chuẩn.
- **Khoảng cách:** `gap-6` giữa bảng và biểu đồ trên desktop.

## 4. Typography
- **Tiêu đề bảng:** `text-sm font-semibold uppercase text-muted-foreground`.
- **Số liệu (Giá):** Sử dụng `text-lg` hoặc `text-xl`, font `tabular-nums font-mono` hoặc `Geist Mono`.
- Mức độ thay đổi (VD: `+500đ`) dùng màu semantic (Xanh lá) kèm font medium.

## 5. Màu sắc
- Bảng có border mỏng, nền các ô dữ liệu có xen kẽ sọc ngựa vằn (Zebra striping) rất nhạt (`bg-muted/30` ở dòng chẵn) để dễ đọc bảng lớn.
- Biểu đồ sử dụng màu Xanh Primary cho đường Line, đổ gradient mờ dần xuống trục X (Area chart).

## 6. Component
- `Table` (Data Table phức tạp, có Sticky header).
- `Select` / `DropdownMenu` (Dành cho Bộ lọc - Chọn loại cà phê Robusta/Arabica).
- `Chart` (Sử dụng thư viện Recharts hoặc Visx, bọc trong cấu trúc UI chuẩn).
- `Badge` (Đánh dấu Tăng/Giảm/Đi ngang).

## 7. Animation
- Biểu đồ: Hiệu ứng vẽ đường line từ trái sang phải khi tải trang (`duration-700 ease-out`).
- Khi thay đổi bộ lọc, dữ liệu trong bảng mờ đi nhẹ (`opacity-50`) rồi hiện lại ngay lập tức (không hiển thị spinner cồng kềnh).

## 8. Responsive
- **Mobile:**
  - Bố cục lưới vỡ ra thành 1 cột. Thống kê nhanh -> Biểu đồ -> Bảng.
  - **CỰC KỲ QUAN TRỌNG:** Bảng giá trên mobile chuyển sang chế độ vuốt ngang (`overflow-x-auto`) hoặc biến thành danh sách các Thẻ (Card list) theo từng tỉnh thành.
