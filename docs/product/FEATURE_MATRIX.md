# Ma trận Tính năng (Feature Matrix)

## Mục tiêu
Phân loại các tính năng theo Mức độ ưu tiên (P0, P1, P2) và Khối (Module).

## Khối 1: Bảng Giá (Market Data)
| Tên Tính năng | Mô tả | Mức độ Ưu tiên | Giai đoạn |
|---|---|---|---|
| Giá Cà phê Nội địa | Bảng giá thu mua tại Đắk Lắk, Lâm Đồng, Gia Lai | P0 | MVP |
| Giá Sàn Thế giới | Trực tuyến sàn ICE London (Robusta), NY (Arabica) | P0 | MVP |
| Biểu đồ Giá (Chart) | Lịch sử giá 1 tuần, 1 tháng, 1 năm | P1 | MVP |
| Cảnh báo Giá (Alert) | Gửi thông báo khi giá đạt mức Nông dân cài đặt | P2 | V1.2 |
| Chuyển đổi Tỷ giá | Tự động nhân tỷ giá USD/VND cho giá Thế giới | P1 | MVP |

## Khối 2: Tin tức & Kiến thức (Content)
| Tên Tính năng | Mô tả | Mức độ Ưu tiên | Giai đoạn |
|---|---|---|---|
| Đọc Tin thị trường | Báo cáo phân tích vĩ mô, biến động nguồn cung | P0 | MVP |
| Dự báo Thời tiết | Tích hợp OpenWeather, cảnh báo mưa bão cho Tỉnh | P1 | V1.1 |
| Kiến thức Nông nghiệp | Kỹ thuật chăm sóc, trị bệnh cây trồng | P2 | V1.2 |

## Khối 3: Người dùng (User Account)
| Tên Tính năng | Mô tả | Mức độ Ưu tiên | Giai đoạn |
|---|---|---|---|
| Đăng nhập (Auth) | Bằng Số điện thoại (OTP) hoặc Zalo / Google | P1 | V1.1 |
| Lưu bài viết (Bookmark) | Đánh dấu bài viết hay để đọc lại | P2 | V1.2 |
| Đăng giá (Đại lý) | Đại lý địa phương có quyền tự cập nhật giá mua | P3 | V2.0 |

## Khối 4: CMS Admin
| Tên Tính năng | Mô tả | Mức độ Ưu tiên | Giai đoạn |
|---|---|---|---|
| Cập nhật Giá tay | Admin tự nhập giá hàng ngày | P0 | MVP |
| Trình soạn thảo Báo | Viết tin tức, chèn ảnh, lên lịch xuất bản | P0 | MVP |
| Phân tích dữ liệu | Xem lượt truy cập, bài đọc nhiều nhất | P1 | V1.1 |
