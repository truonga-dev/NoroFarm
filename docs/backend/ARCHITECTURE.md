# Kiến trúc Tổng thể (Backend Architecture)

## 1. Triết lý Thiết kế
Backend của NoroFarm được xây dựng dựa trên nguyên lý **Clean Architecture** và **Domain-Driven Design (DDD)** tinh gọn. Mục tiêu là tách biệt hoàn toàn Logic nghiệp vụ (Business Logic) khỏi các công nghệ kết nối ngoại vi (FastAPI, Supabase, Redis).

## 2. Công nghệ Cốt lõi
- **Framework:** FastAPI (Python) - Đảm bảo tốc độ xử lý nhanh, hỗ trợ Asynchronous (Bất đồng bộ) hoàn toàn.
- **Data Layer:** Supabase PostgreSQL (Truy xuất qua HTTPX dạng RESTful, hoặc dùng Thư viện Python chính thức của Supabase).
- **Caching:** Redis (Quản lý trạng thái, giảm tải Database, Rate Limiting).
- **Client HTTP:** HTTPX (Dùng để fetch dữ liệu thời tiết, giá cả từ bên thứ 3 dạng Async).

## 3. Kiến trúc Đa tầng (Layered Architecture)

### Tầng 1: Presentation / API Layer (Router)
- Nhiệm vụ: Tiếp nhận Request HTTP, xác thực JWT (Dependency Injection), xác thực Input (Pydantic), và gọi xuống tầng Service.
- KHÔNG chứa logic nghiệp vụ. Chỉ cấu hình Endpoint (Ví dụ: `GET /api/v1/prices`).

### Tầng 2: Business Logic Layer (Services)
- Nhiệm vụ: Trái tim của ứng dụng. Nhận dữ liệu từ Router, áp dụng các quy tắc kinh doanh (Ví dụ: Kiểm tra xem User có quyền lưu dữ liệu này không, tính toán xu hướng giá).
- Gọi xuống tầng Repository hoặc Cache để lấy/cất dữ liệu.

### Tầng 3: Data Access Layer (Repositories)
- Nhiệm vụ: Tương tác trực tiếp với Database (Supabase) hoặc 3rd-party APIs (OpenWeather).
- Tầng Service không cần biết dữ liệu đến từ Supabase hay MySQL, nó chỉ cần gọi `price_repo.get_latest()`.

### Tầng 4: Cross-Cutting Concerns
- **Middlewares:** Xử lý CORS, Rate Limiting, tính toán thời gian phản hồi (Response Time).
- **Caching (Redis):** Nằm độc lập, có thể được gọi từ Service.
- **Logging & Exceptions:** Quản lý lỗi tập trung, không để lọt Stack Trace ra ngoài.

## 4. Luồng Dữ liệu (Data Flow)
`Client` -> `FastAPI Middleware` -> `Router (Pydantic Validation)` -> `Service (Nghiệp vụ + Redis Cache)` -> `Repository (HTTPX)` -> `Supabase/External API`.
