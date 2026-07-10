# Ảo hóa (Docker)

NoroFarm sử dụng Docker để cô lập môi trường chạy cho Backend FastAPI, đảm bảo "Code chạy được trên máy Dev thì sẽ chạy được trên Production". (Frontend Next.js có thể dùng Docker, nhưng ưu tiên Vercel hơn).

## 1. Cấu trúc Hình ảnh (Docker Image)
- Backend FastAPI được đóng gói thành một Docker Image.
- Sử dụng Image gốc (Base Image): `python:3.12-slim` (Rất nhẹ, tối ưu bảo mật).
- Quy trình Build đa tầng (Multi-stage build) để giảm kích thước Image cuối cùng (Không mang theo compiler C++ hay thư viện build).

## 2. Docker Compose (Dành cho Development)
Trên máy tính lập trình viên, chỉ cần chạy 1 lệnh duy nhất là dựng được toàn bộ hạ tầng Local.
- File `docker-compose.yml` định nghĩa:
  - Container `fastapi_backend` (Chạy code Python).
  - Container `redis` (Cache cục bộ).
  - Trỏ biến môi trường DB về Supabase Local (Hoặc Supabase Staging).

## 3. Triển khai (Deployment) với Railway
Backend NoroFarm không dùng Vercel (Vì Vercel là Serverless hàm ngắn hạn, không phù hợp với việc giữ kết nối Database liên tục và Websocket của FastAPI).
- Phương án tối ưu: Host Docker Image trên nền tảng PaaS như **Railway** hoặc **Render**.
- CI/CD: 
  - Railway kết nối trực tiếp với GitHub repo.
  - Khi có code mới nhánh `main` ở folder `backend/`, Railway tự động lấy `Dockerfile`, Build ra Image mới, và khởi động Container (Zero-downtime deployment).
  - Hỗ trợ Auto-scaling (Tự động tăng số lượng Container nếu CPU tải cao).
