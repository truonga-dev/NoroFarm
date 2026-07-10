# Empty States (Trạng thái Rỗng)

Màn hình trống (khi không có dữ liệu, chưa đăng nhập, hoặc kết quả tìm kiếm trống) không bao giờ được phép trắng trơn. Nó phải giúp người dùng biết chuyện gì đang xảy ra và gợi ý bước tiếp theo.

## 1. Cấu trúc 
1. **Hình minh họa (Illustration/Icon):** Một icon cỡ lớn (`size-12` đến `size-16`) màu xám nhạt (`text-muted`). Không dùng hình vẽ quá phức tạp, giữ nguyên phong cách Line-art của Lucide.
2. **Tiêu đề (Title):** Chữ đậm, to (`text-lg font-semibold`), màu `text-foreground`. Nêu bật tình trạng (VD: "Không tìm thấy kết quả").
3. **Mô tả (Description):** Chữ nhỏ hơn (`text-sm`), màu xám (`text-muted-foreground`). Giải thích chi tiết hoặc đưa ra lý do (VD: "Không có bài viết nào khớp với từ khóa của bạn. Hãy thử lại với từ khóa khác.").
4. **Nút Hành động (Call-to-Action - CTA):** Một nút `Primary` hoặc `Outline` để người dùng thoát khỏi trạng thái rỗng (VD: "Xóa bộ lọc", "Về trang chủ").

## 2. Các Trường hợp (Use cases)
- **Danh sách Tin tức trống:** Icon tờ báo gạch chéo. Nút: Đọc tin mới nhất.
- **Bảng Giá trống (Chưa có dữ liệu hôm nay):** Icon lịch/đồng hồ. Text: "Giá hôm nay đang được cập nhật".
- **Kết quả Tìm kiếm không có:** Icon kính lúp có dấu chấm hỏi. Nút: Xóa từ khóa.
