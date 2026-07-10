# Danh sách Kiểm tra Chấp nhận (Acceptance Checklist)

Tài liệu dùng cho Product Manager (PM) hoặc Khách hàng (Stakeholders) ký duyệt trước khi Code được triển khai lên Môi trường Thực tế (Production Go-Live).

## 1. Unit & Integration Tests (Tự động)
- [ ] Tất cả CI Pipelines trên GitHub Actions đã Xanh (Passed 100%).
- [ ] Tỷ lệ Test Coverage của Backend đạt tối thiểu 80%.
- [ ] Không có Test nào bị bỏ qua (Skipped) một cách đáng ngờ.

## 2. E2E & UI Tests (Tự động)
- [ ] Các kịch bản trọng yếu (Đăng nhập, Xem Giá) chạy thành công trên Browser thật qua Playwright.
- [ ] Không có báo cáo chênh lệch hiển thị (Visual Diff) nào bị bỏ qua trên Chromatic/Storybook.

## 3. QA Testing (Thủ công)
- [ ] QA đã chạy hết 100% các Test Cases được giao.
- [ ] Không còn bất kỳ Lỗi P0 (Critical) và P1 (High) nào chưa được đóng (Resolved).
- [ ] Ứng dụng hoạt động trơn tru trên cả iPhone Safari và Android Chrome.

## 4. Performance & Security
- [ ] Điểm Lighthouse Frontend trên môi trường Staging đạt tối thiểu 90 điểm (Mobile & Desktop).
- [ ] Báo cáo quét lỗ hổng (Snyk / Dependabot) Không còn cảnh báo Đỏ (High/Critical Vulnerability).

## 5. Quy trình Chấp nhận User (UAT)
- [ ] Giám đốc Dự án (PM) hoặc Đại diện Nông dân đã dùng thử bản Staging trong 2 ngày mà không có phàn nàn nghiêm trọng.

*Bất cứ ô nào bị đánh X Đỏ hoặc chưa hoàn thành -> Hoãn Release (Rollback) cho đến khi sửa xong.*
