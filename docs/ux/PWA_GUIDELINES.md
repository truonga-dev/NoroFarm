# PWA (Progressive Web App) Guidelines

NoroFarm được thiết kế để mang lại trải nghiệm giống 100% Ứng dụng di động (Native App) thông qua công nghệ PWA. Điều này cực kỳ quan trọng đối với tệp người dùng nông dân thường xuyên ra đồng rẫy - nơi sóng 3G/4G chập chờn.

## 1. Cài đặt (Installation)
- Người dùng có thể nhấn nút "Thêm vào màn hình chính" (Add to Home Screen) từ trình duyệt.
- Website biến thành một App: Cố định App Icon trên màn hình (Favicon 192x192, 512x512).
- Khởi động PWA: Không hiển thị thanh địa chỉ (URL bar) của trình duyệt web (Chế độ `display: standalone`).

## 2. Offline-First Architecture (Kiến trúc ưu tiên Ngoại tuyến)
- **Service Workers:** Cài đặt Service Worker (Workbox) để tự động lưu bộ nhớ đệm (Cache) toàn bộ HTML, CSS, JS cốt lõi ngay lần truy cập đầu.
- **Stale-while-revalidate:** Chiến lược fetch dữ liệu. Khi người dùng mở App, tải ngay lập tức dữ liệu CŨ từ Cache (0 giây chờ). Song song ngầm gửi request lấy dữ liệu MỚI. Khi có dữ liệu mới, UI tự động update mượt mà.
- **Fallback Page:** Nếu người dùng mất mạng 100% và đang mở một trang chưa từng lưu cache, thay vì hiện màn hình Khủng long Chrome, PWA sẽ hiện trang "Bạn đang ngoại tuyến" mang thương hiệu NoroFarm (Custom Offline Page).

## 3. Hiệu năng & Pin (Performance & Battery)
- Các thiết bị ở nông thôn thường có cấu hình yếu và mau hết pin.
- Hạn chế tối đa các tác vụ tính toán nặng bằng Javascript ở Client. Mọi logic tính toán biến động giá, phần trăm đều phải xử lý ở Backend. Frontend chỉ Render.
- Tối ưu màu sắc Dark Mode để tiết kiệm pin cho màn hình OLED/AMOLED.
