# Tổng quan Triển khai (Deployment Architecture)

## 1. Hạ tầng Đám mây (Cloud Infrastructure)
NoroFarm áp dụng kiến trúc Serverless & Containerization kết hợp để tối ưu chi phí (Startup) và khả năng mở rộng (Scalability).

- **Mạng biên (Edge Network) & DNS:** `Cloudflare`. (Bảo vệ DDOS, SSL, Global CDN, Caching tĩnh).
- **Frontend (Web App):** `Vercel`. (Next.js hosting, Serverless Functions, Edge Middleware).
- **Backend (API):** `Railway` hoặc `Render`. (Dockerized FastAPI, Long-running process, Redis).
- **Cơ sở dữ liệu (Database):** `Supabase`. (Managed PostgreSQL, Auto-scaling, Storage, Auth).

## 2. Mô hình Môi trường (Environments)
Dự án được chia thành 3 môi trường tách biệt:
- **Development (Dev):** Chạy trên máy tính cá nhân của lập trình viên (Localhost, Docker Compose).
- **Staging / Preview:** Triển khai tự động mỗi khi có Pull Request (PR). Dùng để Tester/QA kiểm tra trước khi gộp (Merge). Dữ liệu được cô lập hoàn toàn với Production.
- **Production (Prod):** Môi trường thực tế phục vụ khách hàng. Chỉ được deploy qua nhánh `main` sau khi Review.

## 3. Quy trình CI/CD (Continuous Integration / Continuous Deployment)
Sử dụng **GitHub Actions** làm Trái tim điều phối:
1. Lập trình viên push code lên nhánh `feature/xxx`.
2. Mở Pull Request vào nhánh `main`.
3. **CI Triggered:** GitHub Actions chạy các job: Lint (Ruff/ESLint), Type Check (Mypy/TSC), Unit Tests.
4. Vercel tự động tạo Preview Deployment cho Frontend.
5. Sau khi Review và Merge vào `main`.
6. **CD Triggered:** 
   - GitHub Actions build Docker image Backend và push lên Registry (Hoặc Railway tự động build từ nhánh `main`).
   - Vercel tự động build và deploy Frontend lên Production.
   - Supabase tự động chạy DB Migrations thông qua CLI GitHub Action.
