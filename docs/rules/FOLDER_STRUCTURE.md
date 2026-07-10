# Quy tắc Cấu trúc Thư mục (Folder Structure Rule)

## Lệnh Cấm (Directive Constraint)
AI Agent KHÔNG ĐƯỢC TỰ Ý THÊM, XÓA, HOẶC DI CHUYỂN các thư mục cấp Root (Gốc) nếu chưa có lệnh trực tiếp từ Người dùng. Mọi file sinh ra phải tuân thủ tuyệt đối cấu trúc (Skeleton) đã được định nghĩa.

## 1. Cấu trúc Frontend (Next.js 15 - App Router)
```text
frontend/
├── src/
│   ├── app/                # Nơi chứa Pages (Routing) và Layouts (Chỉ code SSR tại đây).
│   ├── components/         # Các khối UI chung (Re-usable).
│   │   ├── ui/             # Shadcn/ui core components (Nút, Input). KHÔNG SỬA TẠI ĐÂY.
│   │   └── shared/         # Các components ghép từ UI core (Ví dụ: Navbar, Footer).
│   ├── features/           # Chứa các Module nghiệp vụ độc lập (Feature-Sliced Design).
│   │   └── coffee-prices/  # VD: Module tính giá.
│   │       ├── components/ # Component chỉ dùng cho tính giá.
│   │       ├── hooks/      # Custom hooks của tính giá.
│   │       └── api/        # API calls của tính giá.
│   ├── lib/                # Cấu hình thư viện ngoài (Axios, Supabase client, Utils).
│   ├── types/              # Khai báo TypeScript Interfaces Global.
│   └── styles/             # Global CSS (globals.css, tailwind config).
```

## 2. Cấu trúc Backend (FastAPI)
```text
backend/
├── app/
│   ├── api/                # Nơi chứa các Router (Controllers). Nhận Request, trả Response.
│   ├── core/               # Cấu hình hệ thống (Settings, Security, JWT).
│   ├── db/                 # Cấu hình Kết nối DB (Session, Migrations/Alembic).
│   ├── models/             # Định nghĩa SQLAlchemy Models (Database Tables).
│   ├── schemas/            # Định nghĩa Pydantic Models (Validation Request/Response).
│   ├── services/           # Chứa Logic Nghiệp vụ Core (Business Logic). Tương tác qua lại giữa Models và Controllers.
│   └── utils/              # Các hàm dùng chung (Helpers, Formatters).
```

## Nguyên lý Feature-Sliced Design (Frontend)
Tránh việc ném toàn bộ components của dự án vào thư mục `src/components`. Những component nào chỉ phục vụ cho một màn hình hoặc nghiệp vụ cụ thể (Ví dụ: Biểu đồ giá cà phê) phải được đóng gói vào thư mục `src/features/...` để đảm bảo tính Module hóa, dễ tháo lắp.
