# Error Handling (Xử lý Lỗi)

Bất kỳ hệ thống nào cũng sẽ có lúc gặp lỗi (Mất mạng, Server down, Không tìm thấy trang). Cách xử lý lỗi quyết định ấn tượng của người dùng về sự chuyên nghiệp của thương hiệu.

## 1. Nguyên tắc cốt lõi
- **Không đổ lỗi cho người dùng:** Sử dụng ngôn ngữ trung lập, khách quan.
- **Luôn đưa ra lối thoát:** Không bao giờ để người dùng bị kẹt ở một màn hình chết (Dead-end). Luôn có nút "Thử lại", "Tải lại trang" hoặc "Về Trang Chủ".

## 2. Các loại Lỗi và Giao diện xử lý
### Lỗi 404 (Không tìm thấy trang)
- Là một trang độc lập (Full page).
- Tiêu đề: "Trang này không tồn tại hoặc đã bị xóa."
- Hành động: Hiển thị một nút to, rõ ràng "Quay lại Trang Chủ". Phía dưới gợi ý thêm 3 link bài viết tin tức mới nhất để giữ chân người dùng.

### Lỗi 500 (Lỗi Máy chủ / Backend sập)
- Là một trang độc lập hoặc Fallback Error Boundary (trong React).
- Tiêu đề: "Hệ thống đang gặp sự cố nhỏ."
- Mô tả: "Chúng tôi đang khắc phục. Xin lỗi bạn vì sự bất tiện này."
- Hành động: Nút "Thử tải lại trang".

### Lỗi Mất mạng (Offline/Network Error)
- Đây là lỗi phổ biến nhất ở vùng nông thôn.
- Không chuyển sang trang lỗi toàn màn hình. Giao diện cũ vẫn giữ nguyên (hiển thị dữ liệu từ Cache PWA).
- Hiển thị một **Toast Notification** màu xám (hoặc đỏ nhạt) ở góc dưới màn hình: "Mất kết nối mạng. Đang hiển thị dữ liệu cũ."
- Khi có mạng lại: Tự động tải lại data (SWR/React Query) và hiện Toast xanh: "Đã kết nối lại mạng".

### Lỗi Validate Biểu mẫu (Form Errors)
- Hiển thị Text màu Đỏ (`text-destructive`) ngay bên dưới trường Input bị lỗi.
- Border của Input chuyển sang màu đỏ.
- Ví dụ: "Vui lòng nhập đúng định dạng số điện thoại (10 số)".
