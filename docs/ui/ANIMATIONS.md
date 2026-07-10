# Animations (Hiệu ứng chuyển động)

NoroFarm không lạm dụng hiệu ứng mà sử dụng **Functional Animation** (Chuyển động có mục đích) để làm rõ ngữ cảnh và hướng dẫn mắt người dùng.

## 1. Engine
- Tất cả animation phức tạp (Page transition, list reordering, layout shift) sử dụng **Framer Motion**.
- Các hiệu ứng hover/focus tĩnh sử dụng CSS Transitions (Tailwind classes).

## 2. CSS Transitions (Hover/Focus)
- Sử dụng `transition-all` hoặc các transition riêng lẻ với thời gian `duration-200` (nhanh) hoặc `duration-300` (mượt).
- Timing function: `ease-out` (bắt đầu nhanh, kết thúc chậm lại).

## 3. Framer Motion (Vật lý Lò xo - Spring Physics)
Thay vì dùng `ease` truyền thống, NoroFarm ưu tiên Spring physics để tạo cảm giác tự nhiên như vật lý đời thực (Apple style).

- **Spring mặc định:** `type: "spring", stiffness: 400, damping: 30`. Dùng cho pop-up Modal, Tooltip nảy lên.
- **Bouncy Spring:** Dành cho các feedback nhỏ giọt.

## 4. Các Loại Chuyển Động
### Page Transitions
- Fade in (Opacity 0 -> 1) kết hợp trượt nhẹ từ dưới lên (`y: 20px -> 0px`). Tạo cảm giác nội dung đang được tải và bay vào tầm nhìn một cách trơn tru.

### Staggered List (Danh sách trượt)
- Khi tải xong Danh sách Giá Nông Sản hoặc Tin Tức, các Card sẽ không hiện ra cùng 1 lúc mà hiện lần lượt cách nhau `0.05s` hoặc `0.1s` (staggerChildren).

### Micro-interactions
- Bấm nút Like (Tim): Scale xuống rồi bật to lên.
- Skeleton Loading: Hiệu ứng sóng shimmer mượt mà (gradient lướt qua).
