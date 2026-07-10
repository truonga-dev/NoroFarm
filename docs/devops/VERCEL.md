# Triển khai Frontend (Vercel)

Vercel là nền tảng tối ưu nhất (First-class citizen) để host Next.js, framework cốt lõi của NoroFarm UI.

## 1. Cấu hình Dự án (Project Setup)
- Kết nối trực tiếp Repo GitHub với Vercel Project.
- Framework Preset: `Next.js`.
- Root Directory: `frontend/`.

## 2. CI/CD Tích hợp sẵn (Zero-config)
- Vercel sẽ lắng nghe các sự kiện Git (Push, PR).
- **Preview Deployments:** Mỗi PR sẽ sinh ra một URL riêng biệt (Vd: `norofarm-pr-123.vercel.app`) để test. Bất kỳ thay đổi nào vào PR đều làm URL này cập nhật ngay lập tức.
- **Production Deployments:** Bất cứ commit nào merge vào `main` sẽ tự động lên `norofarm.com`.

## 3. Serverless & Edge Middleware
- API Routes của Next.js (Nếu có dùng làm BFF - Backend For Frontend) sẽ tự động biến thành AWS Lambda Serverless Functions.
- Các Middleware (Chặn quyền truy cập, Rewrite URL, i18n Routing) sẽ chạy trên mạng Edge của Vercel (Gần người dùng nhất) với tốc độ khởi động 0ms.

## 4. Tối ưu Bộ đệm (Caching & ISR)
- Tận dụng triệt để Vercel Data Cache và Full Route Cache của Next.js 15.
- Các trang tĩnh (Static) hoặc các trang dùng **ISR (Incremental Static Regeneration)** như trang Tin tức sẽ được Cache thẳng trên Vercel CDN, giúp người dùng load trang gần như ngay lập tức mà không gọi xuống Database.

## 5. Tên miền (Custom Domain)
- Domain `norofarm.com` được quản lý bởi Cloudflare.
- DNS Cloudflare trỏ bản ghi `CNAME` hoặc `A Record` về Vercel.
- (Lưu ý: Nếu dùng Vercel, tắt proxy Đám mây màu cam của Cloudflare để Vercel tự động gia hạn chứng chỉ SSL Let's Encrypt).
