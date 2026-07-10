# Giao diện Tổng quan (Home Dashboard)

## 1. Mục đích
Là trung tâm điều khiển (Control Center) dành cho người dùng đăng nhập (Nông dân, Thương lái). Cung cấp cái nhìn toàn cảnh về mọi biến động quan trọng nhất ngay trên một màn hình duy nhất, tối ưu hóa thời gian theo dõi.

## 2. Layout & Bố cục chung
- **Container:** Rộng tối đa `max-w-7xl` căn giữa màn hình. Nền trang xám siêu nhạt (`bg-slate-50`) để làm nổi bật các Widget (Card trắng).
- **Thành phần:** 
  - Sidebar (Bên trái, cố định trên Desktop).
  - Topbar (Chứa Search, Thông báo, Avatar).
  - Vùng nội dung chính (Main Content Area).

## 3. Grid System (Lưới)
- Sử dụng CSS Grid 12 cột (`grid-cols-12`). Các Widget sẽ chiếm số lượng cột khác nhau tùy theo mức độ quan trọng. Khoảng cách (Gap) giữa các Widget là `16px` (`gap-4`) hoặc `24px` (`gap-6`).

## 4. Responsive (Thích ứng đa màn hình)

### 4.1 Desktop (lg, xl)
- Lưới 12 cột phát huy tối đa tác dụng.
- Sidebar mở rộng (250px).
- Hàng 1: [Coffee Widget - 8 cột] + [Weather Widget - 4 cột].
- Hàng 2: [Market Trend - 12 cột].
- Hàng 3: [News Widget - 6 cột] + [Statistics Widget - 6 cột].

### 4.2 Tablet (md)
- Sidebar thu gọn (80px - Chỉ hiện Icon).
- Lưới thu về 2 cột (`grid-cols-2`).
- Coffee Widget chiếm full dòng, Weather Widget nằm dưới.

### 4.3 Mobile (sm, xs)
- Bỏ Sidebar, dùng Bottom Navigation.
- Lưới thu về 1 cột (`grid-cols-1`). Toàn bộ các Widget xếp chồng lên nhau theo chiều dọc (Stack).
- Xếp hạng ưu tiên: Coffee -> Weather -> Market Trend -> News.

## 5. Trạng thái (States & Animation)
- **Animation (Vào trang):** Các Widget không xuất hiện cùng lúc, mà trượt nhẹ từ dưới lên theo dạng bậc thang (Staggered fade-in-up). Mỗi Widget cách nhau `50ms`.
- **Loading / Skeleton:** Khi đang lấy dữ liệu cá nhân hóa, toàn bộ các khối Widget hiển thị Skeleton xám nhạt đập nhịp (Pulse). Hình dáng Skeleton khớp chính xác với Widget thật.
- **Error:** Nếu 1 Widget (Ví dụ Thời tiết) bị lỗi kết nối, chỉ riêng Widget đó hiện Error State (Icon cảnh báo đỏ), các Widget khác (Giá, Tin tức) vẫn hoạt động bình thường (Error Boundary).
- **Empty:** Nếu người dùng chưa chọn nông sản quan tâm, Dashboard hiện một Empty State lớn giữa màn hình: "Hãy chọn mặt hàng nông sản bạn muốn theo dõi".
