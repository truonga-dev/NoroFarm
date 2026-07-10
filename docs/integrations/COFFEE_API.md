# Tích hợp API Giá Cà phê / Nông sản (Coffee & Commodity API)

## Mục tiêu
Tự động hóa việc cập nhật giá cà phê thế giới (Sàn London - Robusta, Sàn New York - Arabica) và giá trong nước, giảm thiểu việc nhập liệu thủ công của Admin.

## Nguồn dữ liệu (Data Sources)
1. **Giá Thế giới (World Market):**
   - Các sàn giao dịch hàng hóa (ICE Futures Europe, ICE Futures US).
   - Có thể tích hợp qua các API tài chính như **Alpha Vantage**, **Bloomberg API** (Chi phí cao), hoặc **Barchart OnDemand**.
2. **Giá Trong nước (Domestic Market):**
   - Đa số không có API chính thức. Cần kết hợp giữa:
     - Viết Bot Cào dữ liệu (Web Scraper / Crawler) bằng `Playwright` hoặc `BeautifulSoup` quét từ các trang tin tức nội địa uy tín mỗi sáng sớm.
     - Hoặc Admin nhập tay từ Bảng điều khiển CMS.

## Chiến lược Tích hợp (World Prices)
- **Real-time vs Delayed:** API chứng khoán/hàng hóa thời gian thực (Real-time) cực kỳ đắt đỏ. Đối với nông dân, dữ liệu trễ 10-15 phút (Delayed Data) là hoàn toàn chấp nhận được và chi phí API rẻ hơn rất nhiều.
- **Tần suất đồng bộ:** 
  - Trong giờ giao dịch của Sàn ICE (Thường là chiều tối đến đêm theo giờ VN): Polling mỗi 15 phút.
  - Ngoài giờ giao dịch: Ngừng Polling để tiết kiệm API Calls.

## Dữ liệu Cần trích xuất
- Giá khớp lệnh gần nhất (Last Price).
- Giá mở cửa, Cao nhất, Thấp nhất trong phiên (OHLC).
- Mức thay đổi so với phiên trước (Change Point & Change Percentage). Hiển thị mũi tên Xanh (Tăng) hoặc Đỏ (Giảm).

## Xử lý Dữ liệu Bất thường (Anomaly Detection)
- Do Bot Cào dữ liệu (Scraper) rất dễ lấy nhầm số (Ví dụ HTML trang nguồn bị đổi cấu trúc). 
- Trước khi lưu giá mới vào Database, Backend phải so sánh với giá hôm qua. Nếu giá Tăng/Giảm đột biến quá 20% trong 1 ngày, hệ thống BỎ QUA không tự động cập nhật, mà gửi Cảnh báo Đỏ qua Telegram/Email yêu cầu Admin vào kiểm duyệt bằng tay.
