# Kiểm thử End-to-End (E2E Test)

## Mục tiêu
Đảm bảo luồng nghiệp vụ quan trọng (Critical Paths) hoạt động hoàn hảo từ góc nhìn của Người dùng cuối. E2E Test mở một trình duyệt thực (Browser), thao tác trên Frontend, gọi API xuống Backend, ghi vào Database và trả kết quả lên UI y như một con người thật.

## Công cụ
- Sử dụng **Playwright** hoặc **Cypress**. Khuyến nghị Playwright vì tốc độ nhanh, hỗ trợ tốt đa trình duyệt (Chromium, Firefox, WebKit).

## Các Luồng Nghiệp vụ (Critical Paths) Cần Test
Không thể viết E2E Test cho mọi nút bấm (Vì chúng chạy rất chậm và dễ đứt gãy - Flaky). Chỉ chọn các luồng cốt lõi:
1. **Luồng Khách hàng:** Truy cập Trang chủ -> Xem giá Cà phê Đắk Lắk -> Xem Tin tức nổi bật.
2. **Luồng Đăng nhập:** Bấm Đăng nhập -> Điền sai (Báo lỗi) -> Điền đúng -> Thấy Avatar cá nhân.
3. **Luồng Admin (CMS):** Đăng nhập Admin -> Thêm bài viết mới -> Xuất bản -> Ra trang chủ xem bài viết có xuất hiện hay không.

## Môi trường Chạy Test
- E2E Test không bao giờ được chạy trực tiếp chọc vào DB Production.
- Cần có một môi trường "Staging" hoặc "Preview Environment" hoàn chỉnh (Cả Frontend + Backend + Database) để chạy E2E trước khi Deploy.
- Test phải tự dọn dẹp (Tear down) dữ liệu rác mà nó tạo ra sau khi chạy xong (Ví dụ tự xóa Bài viết Test đi).

## Tiêu chuẩn Kịch bản (Scripting)
- Sử dụng các thuộc tính chọn lọc (Selectors) bền vững như `data-testid="submit-btn"` thay vì dựa vào Class CSS hay thứ tự thẻ (Vì Class rất dễ thay đổi khi Designer sửa CSS).
- Mọi thao tác click phải kèm theo `wait` (Đợi mạng load xong, đợi Element hiển thị) để chống lỗi Flaky.
