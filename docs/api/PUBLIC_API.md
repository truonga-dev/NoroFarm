# Public API (API Mở - Tùy chọn)

## Tổng quan
(Tương lai) - Nếu NoroFarm muốn đóng vai trò là "Nhà cung cấp dữ liệu" (Data Provider) cho các ứng dụng, website báo chí nông nghiệp khác tại Việt Nam.

## Endpoints

### 1. Lấy mã nhúng Bảng Giá (Embed Widget)
- **Endpoint:** `/api/v1/public/widgets/price?theme=light&lang=vi`
- **Method:** `GET`
- **Response:** Trả về một chuỗi HTML dạng Iframe hoặc một đoạn Javascript nhẹ (`<script>`) để đối tác nhúng vào trang của họ.

### 2. Open Data API (Dành cho nhà phát triển)
- **Endpoint:** `/api/v1/public/data/coffee`
- **Method:** `GET`
- **Header:** `Authorization: Bearer {NOROFARM_API_KEY}`
- **Response:** Dữ liệu chuẩn JSON.

## Đặc tính Kỹ thuật
- **Authentication:** 
  - Widget Iframe: Public hoàn toàn.
  - Data API: Yêu cầu Đối tác phải đăng ký lấy API Key riêng.
- **Cache:** Trọng tâm (Heavily cached). Dữ liệu Public API được sinh tĩnh (Static generation) và nhét thẳng lên CDN để hứng traffic khổng lồ từ bên thứ 3 mà không chạm vào Database chính.
- **Pagination:** Có.
- **Rate Limit:** Dựa trên gói (Plan) của API Key. VD: Gói Free = 1000 req/ngày. Gói Pro = 100.000 req/ngày. Trả về mã lỗi `429 Too Many Requests` kèm Header `Retry-After`.
- **Security:** Bắt buộc áp dụng CORS Headers. Chỉ cho phép các tên miền (Domains) đã đăng ký (Whitelist) mới được nhúng Iframe hoặc gọi API bằng AJAX.
