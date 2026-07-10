# Quy trình làm việc với Git (Git Workflow)

## Mô hình Phát triển (Trunk-based Development)
Để đảm bảo tốc độ Release nhanh (Continuous Deployment), NoroFarm áp dụng mô hình Trunk-based thay vì GitFlow phức tạp.

## Quy tắc Nhánh (Branching Rules)
1. **Nhánh `main`:** 
   - Là nhánh DUY NHẤT được phản chiếu lên môi trường Production. 
   - Tuyệt đối cấm (Protected) việc Push code trực tiếp (Direct commit) lên `main`. Bắt buộc phải qua Pull Request.
2. **Nhánh `staging` (Nếu có):** 
   - Phản chiếu lên môi trường Testing nội bộ. QA sẽ test ở đây.
3. **Nhánh Tính năng (Feature Branch):**
   - Mọi Developer hoặc AI khi code tính năng mới phải tạo nhánh từ `main`.
   - Cú pháp tên nhánh: Tham khảo tài liệu `BRANCHING.md`.

## Nguyên lý Tích hợp Liên tục
- Một Feature Branch KHÔNG ĐƯỢC tồn tại quá 3 ngày. 
- Thay vì giam code 1 tháng để làm 1 tính năng khổng lồ (Gây ra Conflict ác mộng khi Merge), Developer phải chia nhỏ tính năng (Vd: Hôm nay chỉ code cái Nút, Merge lên `main`. Ngày mai code Form, Merge lên `main`). (Kỹ thuật Feature Flags).
- Luôn thực hiện lệnh `git pull --rebase origin main` trước khi tạo Pull Request để đảm bảo nhánh của mình đã được cập nhật code mới nhất từ team.
