# Map Component (Bản đồ)

## Khi nào sử dụng
Dùng trên trang Thời tiết (Hiển thị bản đồ radar mây vệ tinh), hoặc Dashboard vùng nguyên liệu (Bản đồ Tây Nguyên chia theo tỉnh có điểm đánh dấu giá nông sản). Map giúp dữ liệu mang tính địa lý trở nên sinh động và dễ hình dung.

## Kích thước
- Chiếm trọn bề rộng của Card chứa nó. 
- Chiều cao trên Mobile có thể là `300px`, trên Desktop là `h-full` của nửa bên giao diện.

## Typography (Ghim trên Map)
- **Marker Text (Ghim đánh dấu):** Text nhỏ `text-xs font-semibold`. Có thể là con số Giá cả nằm đè ngay lên trên điểm Tỉnh đó. Đóng khung hình Pill (`rounded-full`) màu Primary nổi bật.

## Trạng thái & Tương tác (Interactions)
- **Chạm/Di chuyển (Pan/Zoom):** Bản đồ hỗ trợ cuộn và zoom bằng chuột hoặc chụm ngón tay. (Lưu ý: Nếu Bản đồ nằm trong trang kéo cuộn dài, phải thiết lập 2 ngón tay mới cuộn bản đồ, 1 ngón tay cuộn cả trang. Tránh "bẫy vuốt" (Scroll trap) trên Mobile).
- **Hover (vào Marker):** Marker phóng to nhẹ (`scale-110`). Hiện Tooltip hiển thị thông tin chi tiết của Tỉnh/Trạm thời tiết đó (Ví dụ: Mưa rào, 28 độ).

## Styling (Bản đồ cơ sở)
- NoroFarm không dùng phong cách bản đồ mặc định rực rỡ của Google Maps.
- Cần sử dụng Mapbox hoặc cấu hình Custom Style Google Maps (JSON style).
- **Phong cách (Map Style):**
  - Đơn sắc (Monochrome) hoặc Tối giản (Minimal). 
  - Xóa bỏ các biểu tượng không cần thiết như Trường học, Cửa hàng tiện lợi... Chỉ giữ Đường xá mờ và Biên giới Tỉnh.
  - Vùng Rừng/Cây nông nghiệp có thể làm nổi bật bằng mảng xanh nhạt.

## Ánh sáng (Modes)
- **Light Mode:** Nền đất màu Trắng ngà/Xám siêu nhạt (`#F8FAFC`). Đường nét màu xám trung bình. Nước biển màu xanh cực kỳ nhạt. Marker màu xanh đậm (Emerald).
- **Dark Mode:** Nền đất màu Xanh Đen sẫm (Midnight/Slate-950). Đường màu Slate-800. Marker phải dùng màu chói (Neon / Emerald sáng) để nổi rực lên trong đêm. Bắt buộc thay đổi Map Layer Style khi user lật Dark Mode.

## Accessibility
- Giống Biểu đồ (Chart), dữ liệu Không gian (Spatial) rất khó đọc với Screen Reader. Luôn đi kèm một danh sách/bảng phụ bên cạnh Bản đồ liệt kê dữ liệu thời tiết của các Tỉnh dưới dạng chữ thuần (Text list).
- Bản đồ phải có tiêu đề (Map Title) hoặc `aria-label` tổng quát (Ví dụ: "Bản đồ thời tiết khu vực Tây Nguyên").
