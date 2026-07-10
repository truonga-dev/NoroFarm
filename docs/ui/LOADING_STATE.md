# Loading States (Trạng thái Tải)

Để đảm bảo trải nghiệm mượt mà, người dùng không bao giờ được nhìn thấy màn hình trắng hoặc giật cục (layout shift) khi dữ liệu đang tải.

## 1. Skeleton Loaders
Sử dụng Skeleton cho các nội dung đã biết trước hình dạng (như danh sách bài viết, bảng giá).
- **Màu sắc:** Nền xám nhạt (`bg-muted`), kết hợp animation `animate-pulse` (nhấp nháy chớp tắt) mượt mà.
- **Hình dáng:** Phải mô phỏng y hệt hình dáng của component thật.
  - Ví dụ: Skeleton Card sẽ có 1 cục vuông giả hình ảnh (`h-40 w-full rounded-t-xl`), 1 thanh dài giả Title (`h-6 w-3/4`), và 2 thanh ngắn giả Mô tả (`h-4 w-full`).

## 2. Spinners (Biểu tượng xoay)
Dùng cho các hành động nhỏ, không xác định trước kết quả hoặc kích thước.
- Kích thước mặc định: `16px` (`size-4`) cho trong Nút bấm, `24px` (`size-6`) cho giữa khu vực nhỏ.
- Icon: Icon Spinner dạng đường viền mỏng xoay đều (`animate-spin`), màu xám hoặc màu Primary.
- KHÔNG sử dụng các hình động lặp lại sặc sỡ, lòe loẹt.

## 3. Tránh Cumulative Layout Shift (CLS)
- Mọi thành phần loading (đặc biệt là Skeleton) phải có chiều cao (Height) cố định, khớp với kích thước của nội dung thật khi đã tải xong. Nếu không, khi nội dung tải xong, trang web sẽ bị giật lên xuống, ảnh hưởng cực xấu đến UX và SEO.
