# Giám sát Hệ thống (Monitoring & Observability)

## 1. Giám sát Hiệu suất Ứng dụng (APM)
Để biết API nào chạy chậm, hoặc Frontend có lỗi JS gì ở máy người dùng.
- **Frontend (Sentry):** Tích hợp Sentry SDK vào Next.js. Nếu người dùng bấm nút bị lỗi (Crash app), Sentry sẽ báo cáo ngay lên Dashboard kèm thông tin thiết bị, dòng code bị lỗi.
- **Backend (Sentry / Datadog):** Theo dõi số lượng Request, thời gian xử lý trung bình (Latency), tỷ lệ lỗi (Error Rate) của từng Endpoint API.

## 2. Giám sát Hạ tầng (Infrastructure)
- **Supabase Dashboard:** Theo dõi mức tiêu thụ CPU, RAM của Database. Xem Logs Postgres để phát hiện các câu Query chậm (Slow Queries).
- **Vercel Analytics:** Đo lường Web Vitals (Tốc độ tải trang, Điểm SEO, Thời gian phản hồi LCP/CLS) của người dùng thực (Real Experience Score).
- **Railway/Render Logs:** Theo dõi CPU/RAM của Container chạy FastAPI và Logs Real-time của ứng dụng.

## 3. Cảnh báo Thời gian thực (Alerting)
- Cấu hình Uptime Monitoring (UptimeRobot hoặc BetterStack). Cứ 1 phút ping (gọi) vào endpoint `/health` của Backend.
- Nếu Backend trả về lỗi 500 hoặc Timeout, tự động gửi cảnh báo khẩn cấp (Push Notification/SMS) vào Telegram hoặc Slack của Đội ngũ kỹ thuật.
