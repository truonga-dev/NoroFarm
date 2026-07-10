# Quản trị Tối ưu hóa Tìm kiếm (SEO Management)

## Mục tiêu
Cung cấp công cụ kiểm soát dữ liệu Siêu văn bản (Meta Data) và cấu trúc tìm kiếm (Sitemap/Robots) trên toàn nền tảng, đảm bảo NoroFarm luôn đạt thứ hạng cao trên Google Search.

## Chức năng
- **Global Meta Tags:** Cấu hình Title, Description, và Keywords mặc định cho các trang tĩnh (Home, About).
- **Trang Động (Dynamic SEO):** Định nghĩa cấu trúc Tiêu đề (Ví dụ: `Giá cà phê hôm nay [Ngày] tại [Tỉnh] - NoroFarm`).
- **OpenGraph & Twitter Card:** Tải lên Hình ảnh hiển thị mặc định (OG Image) khi chia sẻ link NoroFarm lên Facebook, Zalo.
- **Robots.txt & Sitemap:** Trình soạn thảo file `robots.txt`. Xem logs quá trình tạo (Generate) `sitemap.xml` tự động mỗi đêm.
- **Chuyển hướng (301 Redirects):** Quản lý các URL cũ bị lỗi 404, chuyển hướng chúng về URL mới để không mất Traffic.

## Layout
- Giao diện chia theo Tabs (Cấu hình chung, Chuyển hướng URL, Trình soạn thảo Robots).

## UI / UX
- **UI:** Form nhập liệu tích hợp Trình xem trước (Google SERP Preview). Khi Admin gõ Meta Title, một ô bên cạnh sẽ mô phỏng hình ảnh kết quả tìm kiếm trông như thế nào trên Google (Mobile/Desktop).
- **UX:** Cảnh báo màu Cam nếu Title vượt quá 60 ký tự hoặc Description vượt quá 160 ký tự (Ngưỡng bị Google cắt cụt).

## Quyền truy cập
- `seo:manage` (Chuyên gia SEO, Marketing Manager).

## Validation
- URL Redirect Từ (From URL): Bắt đầu bằng dấu `/`, không được trùng lặp.
- URL Đích (To URL): Có thể là đường dẫn tuyệt đối hoặc tương đối.

## Luồng xử lý (Chuyển hướng URL)
1. Admin phát hiện URL `/tin-tuc/gia-cu` bị lỗi do đã đổi tên danh mục.
2. Tạo Redirect: Từ `/tin-tuc/gia-cu` -> Tới `/tin-tuc/gia-ca-phe-moi-nhat`. Status `301 Permanent`.
3. Lưu vào bảng `seo_redirects`.
4. Trên Next.js Frontend, Middleware đọc danh sách này (Đã được Cache trên Edge Redis) và lập tức Chuyển hướng người truy cập mà không cần gọi xuống Database.

## API liên quan
- `GET /api/v1/admin/seo/settings`
- `PUT /api/v1/admin/seo/settings`
- `POST /api/v1/admin/seo/redirects`

## Database liên quan
- Bảng `seo_settings` (Dạng Key-Value).
- Bảng `seo_redirects` (from_url, to_url, status_code).

## Responsive
- Hỗ trợ nhập liệu dễ dàng trên mọi thiết bị.

## Security
- Chặn không cho phép tạo Redirect tới các Domain độc hại (XSS/Phishing). Thuộc tính "To URL" nếu là link ngoài thì phải qua bộ lọc whitelist hoặc cảnh báo Admin.

## Logging
- Log toàn bộ các thay đổi Global Meta, vì việc sai cấu trúc SEO có thể đánh tụt hạng toàn bộ dự án trong một đêm.
