# Search API (API Tìm kiếm Toàn cầu)

## Tổng quan
Endpoint đa dụng phục vụ cho thanh Command Palette (Global Search) trên website. Cho phép tìm kiếm "Cà phê", "Sầu riêng" lẫn tìm kiếm Tiêu đề bài viết tức thì (As-you-type).

## Endpoints

### 1. Tìm kiếm Nhanh (Omni Search)
- **Endpoint:** `/api/v1/search?q={keyword}`
- **Method:** `GET`
- **Request Params:** `q` (Từ khóa, độ dài tối thiểu 2 ký tự).
- **Response (200 OK):** Trả về kết quả phân nhóm.
```json
{
  "results": {
    "commodities": [
      { "id": "coffee_robusta", "name": "Cà phê Robusta", "current_price": 110000 }
    ],
    "news": [
      { "id": "123", "title": "Bão ảnh hưởng đến thu hoạch cà phê" }
    ]
  }
}
```

## Đặc tính Kỹ thuật
- **Authentication:** Public.
- **Cache:** 
  - Khó cache ở dạng truyền thống do từ khóa vô tận.
  - Sử dụng Elasticsearch hoặc Postgres Full-Text Search có Indexed.
  - Bật tính năng Debounce ở Frontend (Người dùng ngừng gõ 300ms mới gọi API) để tránh spam API.
- **Pagination:** Giới hạn trả về cực ngắn (`limit=5` cho mỗi nhóm) vì đây là search nhanh trên thanh thả xuống (Dropdown). Không có Next Page.
- **Rate Limit:** Mức trung bình (100 req / phút) để đủ đáp ứng việc gọi liên tục khi gõ phím.
- **Security:** Chống SQL Injection tuyệt đối (Ký tự đặc biệt như `'`, `%` phải được escape kỹ). Giới hạn độ dài từ khóa tìm kiếm (Ví dụ: Max 50 ký tự) để tránh DDOS Query nặng.
