# Cấu trúc Thư mục (Folder Structure)

Backend của NoroFarm tuân thủ chuẩn Modular, chia theo từng Domain (Feature) thay vì chia theo kỹ thuật (Tất cả router một nơi, tất cả models một nơi).

```text
backend/app/
├── core/                   # Cấu hình cốt lõi (Cross-cutting)
│   ├── config.py           # Quản lý Environment Variables (Pydantic BaseSettings)
│   ├── exceptions.py       # Global Exception Handlers
│   ├── security.py         # JWT, Hashing, Password verify
│   └── logger.py           # Cấu hình Structlog / Python Logging
├── db/                     # Khởi tạo kết nối DB/Redis
│   ├── supabase.py         # Client Supabase
│   └── redis.py            # Async Redis Connection Pool
├── api/
│   ├── dependencies/       # Các hàm tiêm phụ thuộc (get_current_user, get_db)
│   ├── middlewares/        # Rate Limiting, Request ID, CORS
│   └── v1/
│       └── router.py       # Gom tất cả API v1 lại
├── modules/                # (Quan trọng) Chứa các chức năng nghiệp vụ độc lập
│   ├── auth/               # Domain: Xác thực
│   │   ├── router.py       # API Endpoints
│   │   ├── schemas.py      # Pydantic Models (Request/Response)
│   │   └── service.py      # Logic đăng nhập, cấp token
│   ├── prices/             # Domain: Giá cả
│   │   ├── router.py       
│   │   ├── schemas.py      
│   │   ├── service.py      # Logic lấy giá, format dữ liệu
│   │   └── repository.py   # Gọi Supabase API
│   ├── weather/            # Domain: Thời tiết
│   │   └── ...
│   └── news/               # Domain: Tin tức
│       └── ...
└── main.py                 # Điểm khởi chạy (Entry point) của FastAPI app
```

## Giải thích Modules (Domain-Driven)
Nếu mai sau dự án mở rộng, muốn tách module `weather` ra thành một Microservice riêng biệt, việc copy nguyên thư mục `app/modules/weather/` sang Project mới là cực kỳ dễ dàng vì nó chứa trọn vẹn cả Router, Service, Schema nội bộ.
