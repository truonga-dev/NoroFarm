# Quản lý Xu hướng Thị trường (Market Trend Management)

## Mục tiêu
Dữ liệu xu hướng thị trường vĩ mô thường không phải là từng con số giá cả cục bộ, mà là các Chỉ số (Indicators) lớn như "Tổng lượng xuất khẩu", "Tồn kho thế giới", "Chênh lệch Cung - Cầu". Module này cho phép nhà phân tích (Analyst) của NoroFarm nhập liệu các báo cáo và số liệu vĩ mô.

## Chức năng
- **Báo cáo Thống kê (Statistics Entries):** Nhập số liệu thống kê (Tuần/Tháng). Ví dụ: Sản lượng thu hoạch tuần này.
- **Bình luận Thị trường (Market Commentary):** Viết đoạn tóm tắt ngắn khoảng 1-2 câu để gắn lên đầu Widget Biểu đồ ngoài trang chủ. (Ví dụ: "Thị trường chững lại do lực bán mạnh từ Brazil").
- **Nhãn cảnh báo (Market Sentiments):** Gắn cờ thị trường: Bullish (Tăng), Bearish (Giảm), Neutral (Đi ngang).

## Layout
- Giao diện lai giữa Bảng dữ liệu (cho thông số) và Form văn bản (cho Bình luận).

## UI / UX
- **UI:** Form thiết kế chia làm 2 vùng. Vùng số liệu (Các ô input ngắn), Vùng phân tích (Textarea). 
- **UX:** Khi nhập số liệu xuất nhập khẩu, tự động tính toán tỷ lệ % tăng giảm so với kỳ trước để Analyst đỡ phải tự bấm máy tính.

## Quyền truy cập
- `market:manage` (Chuyên gia phân tích, Manager).

## Validation
- Các số liệu vĩ mô thường rất lớn (Hàng triệu tấn), cần hỗ trợ định dạng hàng nghìn (ngăn cách bằng dấu phẩy) lúc đang gõ. Nếu không Admin đếm số 0 sẽ rất hoa mắt.

## Luồng xử lý
1. Cuối mỗi tuần, Analyst vào tạo một Báo cáo Tuần (Weekly Report).
2. Chọn Nhãn Sentiment: Bearish (Tiêu cực). Viết tóm tắt 1 câu.
3. Bấm Đăng.
4. Mọi Widget ngoài Trang chủ (Market Trend, Statistics) tự động lấy dữ liệu tóm tắt và chỉ số Indicator này để đắp lên giao diện (Render) thay vì tự đi tính toán từ Bảng Prices.

## API liên quan
- `GET /api/v1/admin/market-analysis`
- `POST /api/v1/admin/market-analysis`

## Database liên quan
- Cần tạo bảng mới: `market_reports` (Kỳ báo cáo, loại chỉ số, giá trị, tóm tắt).

## Responsive
- Hoạt động tốt trên mọi thiết bị.

## Error Handling
- Lỗi nhập sai kiểu dữ liệu (Gõ chữ vào ô nhập sản lượng). Báo lỗi ngay tại Input Field.
