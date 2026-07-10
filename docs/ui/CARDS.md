# Cards (Thẻ nội dung)

Thẻ (Card) là đơn vị bao bọc nội dung cốt lõi của NoroFarm, từ bản tin thời tiết, báo cáo giá cả đến bài viết tin tức.

## 1. Cấu trúc Card
Một Card chuẩn bao gồm:
- **CardHeader:** Chứa tiêu đề (Title) và chú thích (Description).
- **CardContent:** Nội dung chính (Văn bản, biểu đồ, bảng giá).
- **CardFooter:** Các nút hành động (Button) hoặc metadata phụ trợ.

## 2. Kiểu dáng (Styling)
- **Background:** Nền Card thường khớp với màu `Surface` (xem Color System).
- **Border:** Border rất mỏng (1px) `border-border`, bo góc radius `xl` (16px) hoặc `lg` (12px) để tạo cảm giác tròn trịa thân thiện.
- **Padding:** Mặc định là `24px` (`p-6`) cho các card lớn, `16px` (`p-4`) cho các thẻ nhỏ trên mobile.

## 3. Các loại Card
### 1. Interactive Card (Có thể click)
Được dùng trong Danh sách Tin tức hoặc Menu Nông sản.
- **Hover State:** Thẻ sẽ nổi bật lên qua shadow (`shadow-md`), viền đổi màu, hoặc dịch chuyển nhẹ lên trên (`-translate-y-1`). Transition mượt (`duration-300`).

### 2. Dashboard/Widget Card
Được dùng hiển thị số liệu (Ví dụ: Nhiệt độ hiện tại, Giá hiện tại).
- Cấu trúc chặt chẽ, tối ưu số to (Display typography) ở giữa. Thường không có hover effect nếu không click được.
- Có thể kết hợp gradient nền tinh tế nếu là widget quan trọng (VD: Widget Thời tiết khắc nghiệt).
