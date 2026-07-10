# Quản lý Giá Cà phê & Nông sản (Price Management)

## Mục tiêu
Phân hệ quan trọng bậc nhất của Data Entry. Nơi các chuyên viên thị trường hoặc Tool cào dữ liệu (Crawler) tự động cập nhật giá mua bán thực tế tại các vùng nguyên liệu mỗi ngày.

## Chức năng
- **Cập nhật Giá thủ công (Manual Entry):** Dành cho chuyên viên nhập giá (Bằng tay).
- **Import Hàng loạt (Bulk Import):** Hỗ trợ Upload file Excel/CSV chứa giá của 50 tỉnh thành cùng lúc.
- **Duyệt Giá (Approval Workflow):** Nếu dữ liệu được tự động cào bởi Bot, cần có Admin vào kiểm tra tính hợp lý trước khi bấm "Phát sóng" (Broadcast) ra ngoài cho nông dân xem.
- **Hiệu đính (Correction):** Sửa lại giá của một ngày trong quá khứ nếu phát hiện nhập sai.

## Layout
- **Màn hình Nhập liệu Nhanh (Quick Entry):** 
  - Giao diện dạng Bảng ma trận giống Excel (Spreadsheet-like Grid).
  - Cột dọc: Danh sách Tỉnh thành. Cột ngang: Giá mua, Giá bán.
  - Phía trên có Nút chọn Ngày và Chọn Loại nông sản.

## UI / UX
- **UI:** Bảng nhúng (DataGrid) không có phân trang khi đang nhập liệu để tạo cảm giác điền form liên tục.
- **UX:** 
  - Hỗ trợ di chuyển giữa các ô bằng phím mũi tên và Tab (Trải nghiệm giống hệt Excel).
  - Highlight màu Đỏ/Xanh nếu giá nhập vào lệch quá 20% so với hôm qua (Cảnh báo chống gõ nhầm số 0 - Fat-finger error).

## Quyền truy cập
- `prices:create`, `prices:update` (Data Entry, Editor).
- `prices:approve` (Manager - nếu kích hoạt luồng Duyệt giá).

## Validation
- Giá: Phải là số dương (> 0).
- Chênh lệch bất thường (Anomaly Detection): Nếu Giá cà phê hôm qua là 110,000, nhập hôm nay là 11,000 (Thiếu 1 số 0) -> Hệ thống bật cảnh báo Vàng "Giá giảm 90%, bạn có chắc chắn không?".

## Luồng xử lý (Nhập giá hàng loạt qua Giao diện)
1. Chuyên viên chọn Nông sản: Cà phê, Ngày: Hôm nay.
2. Hệ thống load bảng danh sách Tỉnh thành. Giá hôm qua hiển thị mờ bên cạnh để tham khảo.
3. Chuyên viên dùng Tab gõ giá mới cho từng Tỉnh. Dữ liệu chưa lưu.
4. Bấm "Lưu tất cả" (Save All).
5. Frontend gom toàn bộ dữ liệu thành một Mảng Array JSON bắn về API.
6. Backend Insert hàng loạt vào Database (Bulk Insert).
7. Backend xóa Cache Giá mới nhất (Invalidate Cache), kích hoạt WebSocket bắn thông báo "Bíp" (Update) chớp nhoáng tới tất cả thiết bị của Nông dân đang mở App/Web.

## API liên quan
- `GET /api/v1/admin/prices/daily-sheet` (Lấy form điền giá).
- `POST /api/v1/admin/prices/bulk` (Lưu hàng loạt).
- `POST /api/v1/admin/prices/import` (Upload CSV).

## Database liên quan
- Bảng `prices`. Do lượng Insert lớn, cân nhắc dùng tính năng `upsert` (Update if exists, Insert if not) dựa trên khóa `(commodity_id, region_id, date)` để tránh trùng lặp nếu Admin vô tình ấn Lưu 2 lần.

## Responsive
- Trải nghiệm nhập liệu Spreadsheet cực kỳ tệ trên Mobile. Ép buộc sử dụng Tablet ngang (Landscape) hoặc Desktop. Nếu vào bằng Mobile, chuyển sang dạng Form truyền thống (Nhập từng tỉnh một).

## Security
- Dữ liệu giá ảnh hưởng đến thị trường. Mọi hành vi cập nhật và hiệu đính quá khứ đều được lưu vết vĩnh viễn (Ai, thời gian, IP, giá cũ, giá mới).

## Logging
- Hệ thống log chi tiết số lượng Record được import thành công và số lượng lỗi do sai định dạng (Khi dùng tính năng Upload File).
