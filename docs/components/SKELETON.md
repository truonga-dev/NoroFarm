# Skeleton Component (Khung xương tải trang)

## Khi nào sử dụng
Thay thế cho Vòng quay tải trang (Spinner/Circular Loader) cổ điển. Skeleton dùng để mô phỏng hình dáng vật lý của phần nội dung ĐANG CHỜ tải (fetch) từ Backend (Ví dụ: Skeleton của một bài báo, Skeleton của Card hiển thị Giá).
Mục đích: Giúp giữ bố cục màn hình không bị nhảy (Cumulative Layout Shift) và tạo hiệu ứng tâm lý "trang đang tải rất nhanh" vì khung xương hiện ra ngay tức thì.

## Kích thước
- Skeleton không có kích thước cố định, mà được lắp ghép linh hoạt (Composability) tùy theo UI thật.
- Các module có thể dùng: Hình tròn (mô phỏng Avatar), Hình chữ nhật dài (mô phỏng Tiêu đề bài viết - width 80% hoặc 100%), Khung lớn (mô phỏng Ảnh Cover).

## Radius
- Kế thừa hệ thống bo góc. Module hình tròn `rounded-full`, hình chữ nhật `rounded-md` hoặc `rounded-lg`.

## Typography / Padding / Shadow
- Hoàn toàn KHÔNG CÓ chữ, không shadow. 
- Margin và Padding phải được canh chỉnh KHỚP 100% với giao diện Component thật (Sau khi tải xong).

## Trạng thái & Hoạt ảnh (Animation)
- **Shimmer / Pulse Effect:** Skeleton KHÔNG ĐƯỢC đứng yên (vì sẽ trông như một mảng xám chết). Nó phải có hiệu ứng chớp tắt chậm (Pulse), hoặc lý tưởng nhất là ánh sáng trắng lướt qua lướt lại dạng độ dốc (Linear-gradient Sweep).
- CSS Tailwind sử dụng `animate-pulse` (Độ mờ thay đổi `0.5 -> 1`).

## Ánh sáng (Modes)
- **Light Mode:** Nền của các thanh Skeleton là màu xám nhạt (`bg-slate-200` hoặc `bg-slate-100`).
- **Dark Mode:** Nền của Skeleton là màu xám đen (`bg-slate-800`).

## Accessibility
- Mọi thành phần hiển thị Skeleton (Skeleton Wrapper) phải đi kèm thuộc tính `aria-busy="true"` hoặc `aria-live="polite"` để Screen Reader (Trình đọc màn hình) thông báo "Nội dung đang được tải...".
- Trình đọc màn hình KHÔNG ĐƯỢC đọc các thanh div xám mô phỏng này. 

## Ví dụ Sử dụng (Use Case)
Khi trang Bảng Giá Cà Phê đang kết nối API, người dùng sẽ thấy 4 Thẻ Card vuông, mỗi Card chứa:
1. Một thanh ngang mờ trên cùng (Tên Tỉnh).
2. Một thanh ngang rất to ở giữa (Giá).
3. Một thanh ngắn ở dưới (Tăng/giảm).
Tất cả nhấp nháy êm dịu, và đùng một cái (sau `50ms`), số liệu thật hiện ra thay thế chính xác vị trí của các khối đó, không một khoảng xê dịch điểm ảnh nào.
