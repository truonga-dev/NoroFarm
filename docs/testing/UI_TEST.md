# Kiểm thử Giao diện (UI & Visual Regression Test)

## Mục tiêu
Phát hiện các lỗi hiển thị (Vỡ layout, lệch CSS, sai màu sắc) khi có những dòng code CSS/Tailwind bị thay đổi vô tình. Đảm bảo giao diện NoroFarm luôn chuẩn "Pixel-perfect" theo đúng thiết kế Figma.

## Công cụ
- Sử dụng **Storybook** kết hợp với **Chromatic** (hoặc **Percy**).

## Phương pháp Kiểm thử Bằng mắt (Visual Regression)
1. Trong lần chạy đầu tiên, công cụ sẽ chụp lại ảnh màn hình (Screenshot) của tất cả các Components (Nút bấm, Thẻ dữ liệu, Form) ở nhiều độ phân giải khác nhau. (Gọi là Baseline).
2. Khi Developer A sửa code CSS và tạo Pull Request (PR). Công cụ sẽ chạy tự động, chụp lại các Component đó một lần nữa.
3. Nó sẽ tự động đè 2 tấm ảnh lên nhau và quét từng Điểm ảnh (Pixel-by-pixel comparison).
4. Nếu phát hiện ra có một Nút bấm tự nhiên bị lệch sang trái 5px, nó sẽ khoanh đỏ tấm ảnh và Báo lỗi trên PR GitHub.
5. Leader hoặc Designer vào xem, nếu đó là sự thay đổi có chủ ý -> Duyệt (Approve). Nếu là Lỗi CSS -> Bắt Dev A sửa lại.

## Kiểm thử Đa thiết bị (Cross-Browser & Device)
- UI Test cũng bao gồm việc đảm bảo trang web hiển thị không lỗi trên:
  - Trình duyệt: Chrome, Safari, Firefox.
  - Hệ điều hành: iOS, Android, Windows, macOS.
  - Kích thước màn hình: Điện thoại (375px), Tablet (768px), Desktop (1440px).

## Trách nhiệm của Frontend Developer
- Luôn phải tự mở DevTools thu nhỏ cửa sổ (Responsive Test) và kiểm tra giao diện bằng tay trước khi đẩy code lên nhánh chính. Công cụ tự động chỉ là lớp bảo vệ thứ 2.
