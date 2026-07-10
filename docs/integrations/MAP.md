# Tích hợp Bản đồ & Vị trí (Maps & Geolocation)

## Mục tiêu
Cung cấp trực quan hóa dữ liệu vùng miền (Bản đồ phân bổ Vùng trồng Cà phê, Bản đồ Giá các tỉnh). Có khả năng tự động nhận diện vị trí người dùng (Geo-IP) để cá nhân hóa dữ liệu thời tiết và giá cả địa phương.

## Nhà cung cấp đề xuất
- **Mapbox** (Khuyên dùng: Render cực đẹp, thư viện `react-map-gl` chạy rất mượt trên Next.js).
- Lựa chọn thay thế: **Google Maps API** (Khá đắt đỏ), **Leaflet + OpenStreetMap** (Miễn phí hoàn toàn nhưng giao diện hơi cũ).

## Tính năng Nhận diện Vị trí (Geolocation)
1. **Edge Geo-IP (Vercel / Cloudflare):**
   - Khi người dùng vào Web, Request sẽ đi qua CDN của Vercel. Vercel sẽ tự động nhúng thông tin Vị trí (Thành phố, Quốc gia) dựa trên IP của người dùng vào HTTP Headers (Vd: `x-vercel-ip-city: Buon Ma Thuot`).
   - Next.js đọc Header này và tự động render trang Chủ với dữ liệu Giá Cà Phê Đắk Lắk lên ưu tiên. Cách này cực kỳ mượt và không cần hỏi quyền người dùng.
2. **Trình duyệt HTML5 Geolocation:**
   - Khi cần độ chính xác cao (Định vị tới từng mét để tính khoảng cách Kho bãi), Frontend sẽ dùng API của trình duyệt: `navigator.geolocation.getCurrentPosition()`.
   - Trình duyệt sẽ bật Popup hỏi "NoroFarm muốn biết vị trí của bạn". Cách này phiền toái, chỉ dùng ở các trang Công cụ tính toán chuyên sâu.

## Bản đồ Nhiệt (Heatmap)
- Vẽ bản đồ Việt Nam, dùng Mapbox tô màu các Tỉnh Tây Nguyên. Tỉnh nào Giá đang tăng mạnh thì tô Đỏ/Cam đậm, Tỉnh nào giảm thì tô Xanh lá. Giúp người dùng có cái nhìn toàn cảnh ngay lập tức.
