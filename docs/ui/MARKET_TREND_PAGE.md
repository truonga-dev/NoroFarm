# Thiết kế: Trang Xu hướng Thị trường

## 1. Mục tiêu
Cung cấp góc nhìn vĩ mô về toàn bộ thị trường nông sản Việt Nam. Giúp người dùng nhận định xem dòng tiền đang tập trung vào đâu, mặt hàng nào đang "sốt" giá.

## 2. Bố cục (Layout)
- **Top Section:**
  - Tiêu đề: "Tổng quan Xu hướng Thị trường".
  - Thời gian cập nhật.
- **Main Grid (Dashboard Layout):**
  - **Khối 1 (Biểu đồ vĩ mô - To nhất):** So sánh xu hướng 3-4 mặt hàng chủ lực (Cà phê, Sầu riêng, Gạo) trên cùng 1 trục thời gian.
  - **Khối 2 (Top Tăng Giá):** Danh sách 3 mặt hàng tăng giá mạnh nhất hôm nay.
  - **Khối 3 (Top Giảm Giá):** Danh sách 3 mặt hàng giảm giá mạnh nhất hôm nay.
- **Bottom Section (Phân tích):**
  - Danh sách bài viết chuyên gia phân tích thị trường.

## 3. Spacing & Typography
- Sử dụng layout bất đối xứng (Asymmetrical layout) tương tự như thiết kế báo chí hiện đại. Biểu đồ chiếm 2/3 màn hình, Top Tăng/Giảm chiếm 1/3 (Cột bên phải).
- Cột bên phải dùng khoảng cách hẹp `gap-4`.
- **Top Tăng/Giảm:** Dùng font số cực lớn cho phần trăm thay đổi (`text-2xl font-bold tabular-nums`), kèm theo nhãn Badge đỏ/xanh rõ ràng.

## 4. Màu sắc
- **Xanh (Tăng):** Sử dụng các sắc thái xanh ngọc từ đậm tới nhạt để xếp hạng Top Tăng.
- **Đỏ (Giảm):** Sử dụng sắc thái Đỏ/Cam cho Top Giảm.
- Biểu đồ line sử dụng chế độ đa màu sắc (Multi-color line chart) với chú giải (Legend) rõ ràng bên dưới.

## 5. Animation
- Hiệu ứng vệt sáng (Shimmer) chạy ngang qua các con số phần trăm tăng trưởng để thu hút sự chú ý.
- Tooltip trên biểu đồ: Tương tác cực nhanh không độ trễ. Khi di chuột dọc theo trục X, một đường gạch dọc theo sát con trỏ và hiện dữ liệu các cột tương ứng.
