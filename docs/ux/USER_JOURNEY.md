# User Journey - NoroFarm

Tài liệu này mô tả hành trình của người dùng (End-to-end journey) khi tương tác với nền tảng NoroFarm. Hành trình được thiết kế theo tư duy Mobile-First và ưu tiên tốc độ (Performance).

## 1. Hành trình Khám phá (Discovery Journey)
- **Điểm chạm (Touchpoints):** Kết quả tìm kiếm Google (SEO), Mạng xã hội, Chia sẻ từ bạn bè.
- **Trải nghiệm:** Tốc độ tải trang < 1.5s (PWA/SSR). Không có pop-up quảng cáo chặn màn hình.
- **Mục tiêu:** Ngay lập tức nhìn thấy giá nông sản mới nhất mà không cần đăng nhập hay thao tác thừa.

## 2. Hành trình Theo dõi Giá (Price Tracking Journey)
1. **Truy cập:** Mở trang chủ hoặc trang Giá Cà phê.
2. **Tiếp nhận thông tin:** 
   - Skeleton loading mượt mà hiển thị cấu trúc trang.
   - Bảng giá hiện ra với hiệu ứng fade-in.
3. **Phân tích:** 
   - Text giá lớn, mã màu Xanh (tăng)/Đỏ (giảm).
   - Biểu đồ xu hướng (Sparklines) tải không độ trễ.
4. **Tương tác ngoại lệ (Lỗi mạng):**
   - Hệ thống hiển thị Toast báo "Mất kết nối mạng", tự động sử dụng dữ liệu Cache cũ nhất có thể (Offline support).

## 3. Hành trình Cập nhật Tin tức (News Consumption Journey)
1. **Duyệt tin:** Chọn mục Tin tức từ Bottom Navigation (Mobile).
2. **Tương tác:** Cuộn trang vô tận (Infinite Scroll) với Skeleton báo hiệu tin đang tải.
3. **Trải nghiệm Đọc:** Giao diện Reader mode, chữ lớn `18px`, không bị xao nhãng.
4. **Chia sẻ:** Nút Share dễ tiếp cận qua Web Share API (Gửi qua Zalo/Facebook mượt mà).

## 4. Accessibility (Khả năng tiếp cận)
- Hành trình người dùng phải khả dụng 100% với bàn phím (Keyboard navigation) và trình đọc màn hình (Screen Readers). Các vùng thao tác (Touch targets) trên Mobile tối thiểu `48x48px`.
