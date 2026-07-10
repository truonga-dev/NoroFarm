# Badge Component (Huy hiệu)

## Khi nào sử dụng
Dùng để làm nổi bật một trạng thái tĩnh, số đếm (vd: số thông báo chưa đọc), hoặc phân loại ngắn gọn (vd: "Đang mở cửa", "Đã chốt giá"). Badge KHÔNG PHẢI là đối tượng tương tác (Không click được).

## Kích thước
- Nhỏ và ôm sát nội dung. 
- Chiều cao thường là `20px` (Medium) hoặc `24px` (Large). Text size `12px` (Caption).

## Typography
- Font weight: `SemiBold` (600) hoặc `Bold` (700). 
- Font size: Rất nhỏ (10px - 12px), thường in hoa chữ cái đầu hoặc viết hoa toàn bộ (`uppercase tracking-wider`).

## Radius
- Đa phần sử dụng bo tròn hoàn toàn `rounded-full` (kiểu con nhộng - Pill).

## Shadow
- Tuyệt đối không dùng Shadow. Phẳng hoàn toàn (Flat).

## Padding
- Padding siêu nhỏ: Trái phải `px-2.5`, Trên dưới `py-0.5`.

## Trạng thái (States)
- Tĩnh, không có trạng thái Hover, Focus hay Active do không click được.

## Ánh sáng (Modes) & Colors (Biến thể màu sắc)
Badge thường mang màu Semantic (Trạng thái) rất mạnh.
- **Default (Trung tính):** Nền Đen chữ Trắng (Light Mode) / Nền Trắng chữ Đen (Dark Mode).
- **Secondary (Xám):** Nền Xám nhạt, chữ Xám đậm. Dùng cho thông tin bớt quan trọng.
- **Success (Thành công):** Nền Xanh lá cây nhạt (`bg-emerald-100`), chữ Xanh lá cây đậm (`text-emerald-800`). Trong Dark Mode: Nền Emerald tối (`bg-emerald-900/50`), chữ Emerald sáng. Dùng cho: Trạng thái Tốt, Giá tăng.
- **Destructive (Lỗi/Xóa):** Nền Đỏ nhạt (`bg-red-100`), chữ Đỏ đậm (`text-red-800`). Dùng cho: Trạng thái Xấu, Giá giảm.
- **Outline:** Không có nền, chỉ có viền mỏng theo màu của Badge.

## Accessibility
- Màu chữ so với màu nền bên trong Badge phải đạt độ tương phản chuẩn.
- Nếu mang tính chất cảnh báo (như lỗi), nên hỗ trợ đọc bằng Screen reader thông qua mã HTML ẩn (vd: `<span class="sr-only">Lỗi: </span>`).
