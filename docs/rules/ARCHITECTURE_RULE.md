# Các Quy tắc Kiến trúc Phần mềm (Architecture Rules)

## Tuyên ngôn Kiến trúc (Architecture Manifesto)
NoroFarm áp dụng triệt để mô hình **Clean Architecture (Kiến trúc Sạch)** cho cả Frontend và Backend. Mục tiêu tối thượng là: Việc thay đổi Database hoặc thay đổi Giao diện UI không được phép làm hỏng Business Logic (Nghiệp vụ).

## 1. Nguyên tắc Backend (FastAPI)
- **Cấm Controller gọi thẳng Database:** File ở tầng `api/` (Routers) chỉ làm nhiệm vụ nhận HTTP Request, kiểm tra JWT, và gọi xuống tầng `services/`. Tuyệt đối không viết lệnh SQLAlchemy `.query()` hoặc `.execute()` bên trong Router.
- **Dependency Injection (Tiêm phụ thuộc):** Bắt buộc sử dụng `Depends()` của FastAPI để tiêm Session Database vào Service. Không khởi tạo kết nối DB cục bộ bên trong hàm. Giúp dễ dàng viết Unit Test (Mocking DB).
- **Nguyên lý Đơn Trách Nhiệm (Single Responsibility):** Một hàm Service chỉ làm 1 việc. (Vd: Hàm tạo User chỉ tạo User, không kiêm luôn việc gửi Email. Việc gửi Email phải bắn ra một Background Task).

## 2. Nguyên tắc Frontend (Next.js)
- **Tách biệt Server & Client (Ranh giới RSC):** Mặc định mọi Component của Next.js 15 là Server Component (Tốc độ, SEO). Chỉ thêm `"use client"` ở DÒNG TRÊN CÙNG của file nếu Component đó thực sự cần tương tác (onClick, onChange) hoặc State (useState, useEffect).
- **Hạn chế Props Drilling:** Không truyền dữ liệu (Props) qua quá 3 tầng Component con. Nếu sâu hơn, phải sử dụng Context API hoặc Zustand để quản lý State toàn cục.
- **Mẫu Thiết kế (Design Patterns):** Khuyến nghị sử dụng mô hình Container-Presenter. (Một Component bọc ngoài làm nhiệm vụ gọi API lấy Data, sau đó truyền Data xuống một Component con chỉ làm nhiệm vụ vẽ Giao diện).
