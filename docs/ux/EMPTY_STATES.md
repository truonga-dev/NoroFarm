# Empty States (Trạng thái Rỗng)

Trạng thái rỗng không được phép là một màn hình trắng hoặc một câu báo lỗi cụt lủn. Nó phải là cơ hội để giao tiếp với người dùng và hướng dẫn họ hành động tiếp theo.

## 1. Thành phần của một Empty State tốt
1. **Hình minh họa (Illustration/Icon):** Một icon Lucide kích thước lớn (`size-16`), màu nhạt (`text-slate-300`).
2. **Tiêu đề (Headline):** Ngắn gọn, giải thích chuyện gì đang xảy ra (Ví dụ: "Chưa có dữ liệu giá").
3. **Mô tả (Description):** Lời giải thích nhẹ nhàng hoặc trấn an (Ví dụ: "Hệ thống đang tổng hợp dữ liệu ngày mới. Vui lòng quay lại sau.").
4. **Call to Action (CTA - Tuỳ chọn):** Nút bấm hướng dẫn họ làm việc khác (Ví dụ: Nút "Tải lại trang" hoặc "Xem tin tức").

## 2. Các kịch bản Empty State tại NoroFarm
### Lỗi Tìm kiếm (Search No Results)
- Tiêu đề: Không tìm thấy kết quả cho "[Từ khóa]".
- Mô tả: "Vui lòng kiểm tra lại chính tả hoặc thử tìm kiếm với từ khóa khác."
- CTA: Nút "Xóa tìm kiếm".

### Biểu đồ chưa có dữ liệu
- Khi một mặt hàng nông sản mới được thêm vào chưa có lịch sử 7 ngày.
- Giao diện: Khung biểu đồ hiển thị mờ, đè lên trên là Icon Biểu đồ gạch chéo.
- Mô tả: "Đang thu thập dữ liệu giá. Biểu đồ sẽ xuất hiện sớm."

### Chưa có bản tin nào
- Icon: Tờ báo mờ.
- Tiêu đề: Chưa có tin tức mới.
- Mô tả: "Chúng tôi đang cập nhật các bản tin nông nghiệp mới nhất trong ngày."
