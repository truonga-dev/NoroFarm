# News API (API Tin Tức)

## Tổng quan
Lấy danh sách các bài viết phân tích, cảnh báo sâu bệnh, và tin tức xuất nhập khẩu.

## Endpoints

### 1. Lấy danh sách Tin tức (Feed)
- **Endpoint:** `/api/v1/news?category={cat}&page={p}&limit={l}`
- **Method:** `GET`
- **Request Params:** `category` (vd: thitruong, kythuat), `page` (mặc định 1), `limit` (mặc định 10).
- **Response (200 OK):**
```json
{
  "items": [
    {
      "id": "123",
      "title": "Xuất khẩu cà phê đạt đỉnh",
      "summary": "Mô tả ngắn gọn...",
      "thumbnail_url": "https://...",
      "published_at": "2026-07-10T..."
    }
  ],
  "meta": {
    "current_page": 1,
    "total_pages": 15
  }
}
```

### 2. Chi tiết Bài viết (Article Detail)
- **Endpoint:** `/api/v1/news/{slug}`
- **Method:** `GET`
- **Response (200 OK):** Trả về toàn bộ HTML/Markdown nội dung bài viết và thông tin Tác giả.

## Đặc tính Kỹ thuật
- **Authentication:** Public.
- **Cache:** 
  - Trang danh sách (Feed): Cache 5-10 phút.
  - Chi tiết bài viết: Cache rất lâu (24h) hoặc tận dụng CDN Edge (Vercel) vì nội dung báo chí hiếm khi thay đổi sau khi xuất bản. Bất hiệu lực bộ đệm (Invalidation) ngay khi Admin sửa bài qua CMS.
- **Pagination:** Bắt buộc. Hỗ trợ Offset/Limit hoặc Cursor-based (Dùng cho tính năng Infinite Scroll trên mobile).
- **Rate Limit:** Nới lỏng (120 req / phút).
- **Security:** Chống XSS (Backend phải làm sạch HTML trước khi lưu vào Database và trước khi trả ra API).
