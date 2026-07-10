# Tích hợp Mạng phân phối nội dung (CDN Integration)

## Mục tiêu
CDN (Content Delivery Network) là hệ thống các máy chủ (Server) đặt ở khắp nơi trên thế giới. Nhờ CDN, nếu người dùng ở Hà Nội mở web NoroFarm, họ sẽ tải dữ liệu từ máy chủ đặt tại Hà Nội. Nếu người dùng ở Mỹ mở web, họ tải dữ liệu từ máy chủ tại Mỹ. Trang web luôn nhanh chớp nhoáng (Mục tiêu dưới 50ms) bất kể khoảng cách địa lý.

## Nhà cung cấp đề xuất
1. **Cloudflare:** (Tùy chọn số 1 về CDN và bảo mật). 
2. **Vercel Edge Network:** Mặc định đi kèm khi Host Next.js trên Vercel. Dùng chung hạ tầng với Cloudflare/AWS.

## Chiến lược Bộ đệm (Caching Strategy)
NoroFarm phải cấu hình CDN cực kỳ khéo léo, phân làm 3 loại dữ liệu:

### 1. Dữ liệu Tĩnh (Static Assets)
- **Gồm:** Logo, CSS, JavaScript, Font chữ.
- **Chiến lược:** Cache Vĩnh viễn (Cache-Control: `public, max-age=31536000, immutable`). Khi nào Developer đẩy Code mới đổi tên file thì CDN tự cập nhật bản mới. Đỡ tốn công.

### 2. Dữ liệu Bán Động (Semi-dynamic - Tin tức)
- **Gồm:** Các bài viết, Trang liên hệ, Chuyên mục.
- **Chiến lược:** Cache tại biên (Edge Caching). Nghĩa là CDN lưu luôn cái khung HTML của trang web đó. Next.js dùng ISR để tạo sẵn HTML đẩy lên CDN. Người dùng bấm phát lên luôn. Khi Editor xuất bản bài viết mới, Backend hoặc CMS phải gọi hàm Webhook (On-demand Revalidation) gửi cho Vercel/Cloudflare lệnh: "Xóa Cache cái đường link bài viết cũ đi, thay bằng link mới".

### 3. Dữ liệu Động hoàn toàn (Dynamic Data - API Giá cả & User Profile)
- **Gồm:** API Lấy giá cà phê theo giây, Thông tin giỏ hàng, Lịch sử cá nhân của Nông dân.
- **Chiến lược:** Tuyệt đối KHÔNG Cache trên CDN (`Cache-Control: no-store`). Mọi truy vấn này sẽ đi xuyên thủng qua lớp phòng ngự CDN, đâm thẳng vào Server Backend FastAPI để lấy dữ liệu tươi nhất.

## Chống D-DoS qua CDN
Cloudflare cung cấp lớp phòng ngự Lớp 7 (Layer 7). Nếu có kẻ thù cố tình thuê Botnet đẩy 1 triệu lượt truy cập vào web NoroFarm để phá sập (D-DoS), Cloudflare sẽ tự động Bật Khiên (Under Attack Mode). Nó sẽ yêu cầu truy cập lạ phải giải Captcha hoặc Check JS trước khi cho lọt qua, bảo vệ tuyệt đối Server FastAPI bên trong không bị sập.
