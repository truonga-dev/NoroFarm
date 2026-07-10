# Trình soạn thảo Tin tức (News Editor)

## Mục tiêu
Công cụ cốt lõi để các nhà báo, chuyên gia phân tích thị trường của NoroFarm tạo ra các bản tin giá cả, phân tích vĩ mô. Yêu cầu mượt mà, ổn định và thân thiện như Medium hoặc Notion.

## Tính năng cốt lõi (Core Features)
- **Block-based Editor:** Thay vì một khung Textarea khổng lồ (Giống Word cũ), Editor nên chia thành các Khối (Blocks) độc lập (Khối Văn bản, Khối Hình ảnh, Khối Quote, Khối Table). Trải nghiệm tương tự Notion.
- **Thanh công cụ Nổi (Floating Toolbar):** Khi bôi đen một cụm từ, thanh công cụ (In đậm, In nghiêng, Chèn Link) sẽ tự động bật lên ngay tại con trỏ chuột, thay vì phải kéo chuột lên tít trên cùng màn hình.
- **Slash Commands (`/`):** Hỗ trợ gõ dấu `/` để mở menu thả xuống chọn chèn Ảnh, Video, Bảng biểu nhanh chóng mà không cần rời tay khỏi bàn phím.

## Các Khối Nâng cao (Advanced Blocks)
Đặc thù của NoroFarm là trang tin Nông sản, nên Trình soạn thảo phải có thêm các Custom Blocks (Do Developer tự code):
- **Block Biểu đồ Giá (Live Price Chart):** Gõ `/chart`, chọn Nông sản (Cà phê), hệ thống tự động nhúng một Biểu đồ giá trực tiếp vào bài viết. Độc giả xem bài báo sẽ thấy biểu đồ động.
- **Block Bảng Giá:** Nhúng bảng giá các tỉnh ngày hôm nay.

## Quản lý Trạng thái (Auto-save & Offline)
- Editor BẮT BỘC phải tự động lưu nháp (Auto-save) sau mỗi 10 giây hoặc mỗi khi người dùng ngừng gõ.
- Hiển thị Trạng thái lưu nhỏ ở góc màn hình: "Đang lưu..." -> "Đã lưu lúc 14:05".
- Nếu mất mạng (Offline), dữ liệu phải được bọc trong LocalStorage và tự động đồng bộ (Sync) lại lên Server khi có mạng.
