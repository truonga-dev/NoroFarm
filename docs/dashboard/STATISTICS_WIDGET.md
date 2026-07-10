# Statistics Widget (Thống kê & Cảnh báo)

## 1. Mục đích
Một khu vực tổng hợp các số liệu thú vị, các chỉ số cảnh báo rủi ro (Ví dụ: "Tồn kho nội địa giảm", "Lượng xuất khẩu tăng mạnh").

## 2. Layout & Bố cục
- Hiển thị theo dạng Bento Grid con bên trong Card. (Các ô hình chữ nhật hoặc vuông nằm so le nhau).
- Ví dụ: 
  - Ô lớn 1: Khối lượng giao dịch (Kèm biểu đồ Sparkline mini).
  - Ô nhỏ 2: Chênh lệch giá cao/thấp nhất trong ngày.
  - Ô nhỏ 3: Tín hiệu thị trường (Badge màu Vàng/Đỏ/Xanh).

## 3. Grid & Responsive
- **Desktop (6 cột):** Nằm cạnh News Widget.
- **Tablet (12 cột):** Dàn thành 4 ô ngang hàng.
- **Mobile:** Chuyển thành Carousel (Vuốt ngang) hoặc Stack dọc tùy độ dài.

## 4. Animation & Trạng thái
- **Animation:** Các con số nhảy liên tục (Count-up) lúc mới tải trang. Sparkline vẽ tự động.
- **Loading / Skeleton:** Khối vuông bo tròn (Bento skeleton) nhấp nháy.
- **Error:** Chữ mờ báo lỗi lấy dữ liệu cục bộ.
- **Empty:** Không khả dụng (Dữ liệu thống kê luôn có dù ở mức 0).
