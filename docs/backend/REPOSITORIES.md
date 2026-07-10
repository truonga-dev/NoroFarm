# Tầng Repositories (Truy xuất Dữ liệu)

## 1. Vai trò
Repository đóng vai trò trung gian giữa Database và Service. Mục đích là che giấu kỹ thuật truy vấn (SQL, Supabase Client, HTTPX) khỏi tầng Service.

## 2. Tiêu chuẩn Thiết kế Repository
- **Chỉ làm việc với Database:** Khác với Service (xử lý logic), Repository chỉ chứa các câu lệnh `select()`, `insert()`, `update()`, `delete()`.
- **Trả về Object chuẩn:** Repository nên trả về Model/Dict chuẩn Python, không trả về đối tượng HTTP Response thô từ DB.

## 3. Quản lý Supabase PostgreSQL
NoroFarm sử dụng Supabase. Việc truy xuất có thể đi qua 2 đường:
- **Cách 1: Thư viện Supabase Python chính thức** (Dùng cho đa số CRUD cơ bản). Khởi tạo `AsyncSupabaseClient`.
- **Cách 2: Viết Query Builder SQL / SQLAlchemy** (Nếu truy vấn quá phức tạp). Hiện tại dự án chuẩn hóa dùng Supabase API Restful để giảm độ phức tạp cài đặt.

### Ví dụ về `PriceRepository`
- `get_latest_prices(region_id: str)`: Tạo lệnh gọi Supabase `.from_("prices").select("*").eq("region_id", region_id).order("valid_from", desc=True).limit(1)`.

## 4. Quản lý Third-party Data (External Providers)
Không phải dữ liệu nào cũng nằm trong Postgres. Thời tiết (Weather) được gọi từ API bên ngoài.
Ta cũng tạo một Repository tên là `WeatherProviderRepository`.
- Sử dụng **`httpx.AsyncClient()`** để bắn Request GET tới OpenWeatherMap.
- Lợi ích: Nếu tương lai đổi sang nguồn AccuWeather, ta chỉ việc viết lại hàm trong file Repository này, toàn bộ `WeatherService` ở trên không bị ảnh hưởng một dòng code nào. Đó chính là sự tuân thủ nguyên lý Clean Architecture.
