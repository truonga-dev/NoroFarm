# User Scenarios (Kịch bản Người dùng)

Mô tả các kịch bản cụ thể mà người dùng sẽ trải qua trên NoroFarm.

## Kịch bản 1: Nông dân kiểm tra giá cà phê sáng sớm
- **Nhân vật:** Chú Tư (55 tuổi, nông dân Tây Nguyên).
- **Mục tiêu:** Xem giá cà phê Đắk Lắk sáng nay có tăng không để quyết định chốt bán.
- **Thiết bị:** Smartphone Android tầm trung, mạng 3G/4G chập chờn.
- **Luồng thao tác:**
  1. Mở trình duyệt, vào NoroFarm (hoặc mở qua icon PWA ngoài màn hình).
  2. Giao diện tải ngay lập tức (Mobile First, cache mạnh).
  3. Đập vào mắt là con số Giá Cà Phê Đắk Lắk cực lớn, mũi tên xanh (+500đ).
- **Ngoại lệ:** Mạng quá yếu. Hệ thống hiển thị "Chưa thể tải giá mới nhất, đây là giá lúc 6h sáng" (Toast vàng cảnh báo).

## Kịch bản 2: Thương lái tìm kiếm xu hướng thị trường
- **Nhân vật:** Anh Hoàng (35 tuổi, thương lái thu mua).
- **Mục tiêu:** So sánh giá cà phê và hồ tiêu để dự đoán dòng tiền.
- **Thiết bị:** Laptop (Desktop), màn hình lớn.
- **Luồng thao tác:**
  1. Truy cập Trang Xu hướng (Market Trend).
  2. Xem biểu đồ Multi-line so sánh 2 mặt hàng.
  3. Rê chuột (Hover) lên biểu đồ. Micro-interaction: Đường dóng thẳng đứng xuất hiện ngay lập tức, hiển thị tooltip giá tại ngày cụ thể.
- **Empty State:** Chọn một mặt hàng mới nhưng chưa có dữ liệu biểu đồ. Hệ thống hiện Card: "Dữ liệu đang được tổng hợp, vui lòng xem các mặt hàng khác."
