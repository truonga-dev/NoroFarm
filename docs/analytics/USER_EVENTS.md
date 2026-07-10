# Từ điển Sự kiện Người dùng (User Events Dictionary)

## Mục tiêu
Định nghĩa một Danh mục (Taxonomy) chuẩn xác cho các Sự kiện (Events) mà Code Frontend cần phải chủ động "Bắn" (Trigger) về hệ thống Analytics (GA4/PostHog). 

## Quy tắc Đặt tên (Naming Convention)
- **Định dạng:** `[Object]_[Action]` (Danh từ _ Động từ). Viết thường, phân cách bằng dấu gạch dưới (Snake_case).
- **Tuyệt đối Không:** Gửi dữ liệu cá nhân (PII - Personally Identifiable Information) như Tên thật, Email, SĐT vào Event Properties. Chỉ gửi ID ẩn danh.

## Danh sách Sự kiện Cốt lõi (Core Events)

### 1. Luồng Xác thực (Auth)
- `user_signup`: Đăng ký thành công. `Properties: { method: "email" | "google" }`
- `user_login`: Đăng nhập.
- `user_logout`: Đăng xuất.

### 2. Hành vi Bảng giá (Market & Prices)
- `price_viewed`: Xem bảng giá. `Properties: { commodity: "coffee", type: "robusta", region: "dak_lak" }`
- `price_alert_created`: Cài đặt báo thức giá. `Properties: { target_price: 120000 }`
- `chart_interacted`: Bấm thay đổi khung thời gian biểu đồ (1D, 1W, 1M).

### 3. Hành vi Tin tức (News & Content)
- `article_viewed`: Đọc bài báo. `Properties: { article_id, category, author }`
- `article_shared`: Chia sẻ bài báo. `Properties: { platform: "zalo" | "facebook" | "copy_link" }`
- `scroll_depth_reached`: Kéo xuống đọc bài. `Properties: { depth: "50%" | "90%" }` (Giúp đo xem bài báo có thực sự được đọc hết không).

### 4. Tìm kiếm (Search)
- `search_performed`: Gõ tìm kiếm. `Properties: { search_term: "giá cà phê arabica" }`
- `search_no_results`: Tìm kiếm nhưng không có kết quả. (Báo động để Admin biết người dùng đang tìm gì mà web chưa có).
