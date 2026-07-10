# Shadow & Glass Effect (Hệ thống Đổ bóng & Kính mờ)

NoroFarm không lạm dụng shadow. Chúng tôi ưu tiên flat design kết hợp border mỏng. Shadow chỉ dùng để mô tả độ cao (Elevation) trên trục Z.

## 1. Shadow (Chỉ áp dụng tốt ở Light Mode)
- **`shadow-sm` (Elevation 1):** Rất mỏng (`rgba(0,0,0, 0.05)`). Áp dụng cho Dropdown Menu, Popover nhỏ.
- **`shadow-md` (Elevation 2):** Áp dụng khi Hover vào Interactive Card (Tin tức, Giá nông sản).
- **`shadow-xl` / `shadow-2xl` (Elevation 3):** Khuếch tán rộng. Chỉ áp dụng cho Modal, Command Palette, Dialog nổi lên chiếm sự chú ý tối đa.

## 2. Glassmorphism (Kính mờ)
Chất liệu kính (Glass) mang lại vẻ đẹp đậm chất Apple/iOS. Áp dụng hạn chế ở 2 nơi:
- **Header Navigation:** Bám dính ở top (`sticky`). Nền trắng/đen Opacity 80%, kết hợp `backdrop-blur-md` (12px).
- **Bottom Navigation (Mobile):** Giống header.

## 3. Dark Mode
- Ở Dark Mode, mọi Shadow vật lý bị vô hiệu hóa (vì không thể tạo bóng đen trên nền đen).
- Thay thế: Đẩy viền (Border) sáng lên 1 tone (`border-slate-700`) để phân định không gian.
