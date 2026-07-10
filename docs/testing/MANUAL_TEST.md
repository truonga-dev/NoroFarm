# Kiểm thử Thủ công (Manual Test / QA)

## Mục tiêu
Máy móc và Test Tự động (Automated Test) chỉ có thể kiểm tra những gì lập trình viên lường trước. Việc kiểm thử bằng tay bởi Con người (Chuyên viên QA/Tester) là chốt chặn cuối cùng để tìm ra các lỗi UX/UI ngớ ngẩn, các cảm nhận bất thường mà máy tính không biết (Ví dụ: Nút bấm bị che khuất một nửa trên màn hình iPhone Mini).

## Phương pháp
- **Exploratory Testing (Kiểm thử khám phá):** QA đóng vai một nông dân không am hiểu công nghệ, hoặc một người dùng phá hoại (Mashing keyboard), để xem ứng dụng có bị treo (Freeze) hay hiển thị lỗi khó hiểu không.
- **Cross-device Testing:** QA phải mượn/chạy máy ảo các thiết bị vật lý thực tế:
  - Máy tính Windows (Chrome, Edge).
  - Macbook (Safari).
  - Điện thoại Android Cũ (Ram yếu, màn hình nhỏ).
  - iPhone (iOS Safari).
- **Network Throttling:** Giả lập mạng 3G yếu bằng Chrome DevTools để xem Skeleton Loading có hiện đẹp không, hay trang web bị vỡ tan tành trước khi load xong dữ liệu.

## Trách nhiệm của QA
- QA là người có quyền phủ quyết (Veto) bản Release. Dù mọi test tự động pass 100%, nhưng QA thấy giao diện sai hoặc flow bị khựng, QA có quyền bấm nút `Reject` trên JIRA/Trello và Developer buộc phải sửa lại.
