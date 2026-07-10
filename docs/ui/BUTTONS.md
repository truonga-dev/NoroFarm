# Buttons (Nút bấm)

Nút bấm là yếu tố tương tác quan trọng nhất, mang lại cảm giác phản hồi xúc giác (tactile feedback) cho người dùng.

## 1. Kích thước (Sizes)
- **sm (Small):** Chiều cao `32px` (`h-8`), Padding ngang `12px` (`px-3`), Font Text-sm (`14px`). Phù hợp cho Card actions.
- **default (Medium):** Chiều cao `40px` (`h-10`), Padding ngang `16px` (`px-4`), Font Base (`16px`). Kích thước chuẩn toàn hệ thống.
- **lg (Large):** Chiều cao `48px` (`h-12`), Padding ngang `32px` (`px-8`), Font Base/Lg. Dùng cho CTA chính ở Landing Page.
- **icon:** Bằng chiều cao mặc định, vuông vắn (VD: `h-10 w-10`). Dùng chứa icon duy nhất.

## 2. Variants (Loại nút)
- **Primary:** Nền màu Primary (Emerald), chữ Trắng. Hover tăng độ sáng nền, scale nhẹ. Dùng cho hành động chính.
- **Secondary:** Nền Muted/Gray (`bg-secondary`), chữ màu Slate. Dùng cho thao tác phụ.
- **Outline:** Nền trong suốt, viền xám (`border-input`), chữ màu Slate.
- **Ghost:** Nền trong suốt, không viền. Hover sẽ hiện nền xám nhạt (`hover:bg-accent`).
- **Destructive:** Nền Đỏ, chữ Trắng. Dùng cho Xóa, Hủy.
- **Link:** Văn bản gạch chân khi hover.

## 3. Animation & Tương tác
- **Hover:** Thay đổi màu nền (`transition-colors duration-200`).
- **Tap/Active:** Lún vật lý bằng CSS Transform (`active:scale-95`).
- **Loading State:** Thay thế icon/text bằng một spinner xoay tròn, nút bị `disabled`, giữ nguyên chiều rộng để tránh giật layout.
