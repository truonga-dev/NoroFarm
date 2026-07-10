# Tối ưu SEO Địa phương (Local SEO)

## Mục tiêu
Thu hút các tìm kiếm mang tính chất vùng miền. Khi một nông dân ở Đắk Lắk gõ "Giá cà phê", Google sẽ ưu tiên hiển thị Giá cà phê Đắk Lắk lên đầu, thay vì giá ở Lâm Đồng.

## Google My Business (Doanh nghiệp của tôi)
- NoroFarm cần đăng ký địa chỉ Trụ sở chính thức trên Google Maps. 
- Khi người dùng tìm "NoroFarm", một bảng Thông tin Doanh nghiệp khổng lồ (Knowledge Panel) sẽ hiện bên phải màn hình, tạo độ tin cậy tuyệt đối.

## Xây dựng Landing Page theo Tỉnh thành
Hệ thống Next.js cần sinh ra các trang Web tĩnh riêng biệt (Static Generation) cho từng tỉnh.
- URL: `norofarm.com/gia-ca-phe/dak-lak`
- URL: `norofarm.com/gia-ca-phe/lam-dong`
- **Nội dung:** Mỗi trang này phải có thẻ H1 riêng biệt "Giá Cà phê hôm nay tại [Tỉnh]", và hiển thị nội dung đặc thù (Thời tiết của tỉnh đó, bài báo liên quan đến tỉnh đó). Không được làm các trang này giống hệt nhau (Tránh lỗi Thin Content).

## Thẻ Meta Geo (Tùy chọn)
Trong cấu trúc Head, bổ sung các thẻ Meta khai báo vị trí địa lý của thị trường chính (Việt Nam).
`<meta name="geo.region" content="VN" />`
`<meta name="geo.placename" content="Ho Chi Minh City" />`
