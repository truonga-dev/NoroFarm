# Thiết kế: Trang Thời Tiết Nông Nghiệp

## 1. Mục tiêu
Cung cấp dữ liệu thời tiết đặc thù cho nông nghiệp (Nhiệt độ, Lượng mưa, Độ ẩm, Khuyến nghị mùa màng) thay vì chỉ là thời tiết sinh hoạt thông thường. Thiết kế phải trực quan, dùng nhiều hình khối (dashboard style) như Apple Weather.

## 2. Bố cục (Layout)
- **Top Section (Vị trí & Hiện tại):** Tên địa phương (Ví dụ: Buôn Ma Thuột), Nhiệt độ khổng lồ, Trạng thái (Nắng ráo/Mưa lớn), và đoạn text ngắn "Khuyến nghị: Thích hợp tưới tiêu".
- **Bento Dashboard:**
  - Block 1 (Hourly): Trượt ngang (horizontal scroll) dự báo 24 giờ.
  - Block 2 (7 Days): Danh sách dọc dự báo 7 ngày.
  - Block 3 (Bản đồ / Radar): Khu vực bản đồ mưa.
  - Block 4 (Thông số phụ): Một grid gồm các ô vuông nhỏ (Lượng mưa, Độ ẩm, Gió, UV).

## 3. Spacing & Grid
- Bố cục Bento Box yêu cầu các khoảng cách chính xác tuyệt đối. `gap-4` hoặc `gap-6` giữa các khối. Các góc bo viền của các khối phải nhất quán (`rounded-2xl` hoặc `rounded-3xl`).
- Widget nhiệt độ hiện tại cần margin top lớn (`mt-12`) để tách biệt.

## 4. Typography
- **Nhiệt độ:** Display size cực lớn (VD: `text-8xl`), font mỏng (`font-light` hoặc `font-thin`) để tạo sự tinh tế như iOS.
- **Tiêu đề Widget:** Chữ nhỏ in hoa (`uppercase text-xs font-semibold text-muted-foreground`), kèm theo icon nhỏ bên cạnh.

## 5. Màu sắc
- Ứng dụng các mảng màu nền Gradient tinh tế dựa trên thời tiết (Ví dụ: Trắng/Xanh dương nhạt cho ban ngày nắng; Xanh đen cho trời mưa). *Tuy nhiên, phải áp dụng rất nhạt để không phá vỡ tính Minimal của tổng thể website.*
- Các thông số như UV, Mưa sử dụng các thanh Progress Bar (dải màu gradient từ Xanh -> Đỏ cho UV).

## 6. Component
- `ScrollArea` (Cho phần dự báo theo giờ).
- `Card` (Làm base cho mọi block bento).
- `Progress` / `Slider` (Minh họa mức độ gió, UV, lượng mưa).
- Icon thời tiết chuyên dụng (Bộ Lucide Weather icons).

## 7. Animation
- Hiệu ứng Background chậm rãi (những đám mây bay qua mờ nhạt hoặc hiệu ứng đổ bóng mượt).
- Các chỉ số (VD: Độ ẩm từ 0 lên 80%) chạy số nhảy (Number counter) khi lần đầu mở trang.

## 8. Responsive
- Mobile: Các bento box xếp chồng thành một cột duy nhất theo mức độ ưu tiên: Hiện tại -> Theo giờ -> Thông số -> 7 Ngày -> Radar.
- Desktop: Tận dụng không gian rộng để trải bento box thành dạng lưới phức tạp (Masonry/Grid) đẹp mắt.
