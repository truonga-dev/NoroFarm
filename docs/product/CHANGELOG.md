# Nhật ký Cập nhật (Changelog)

## Mục tiêu
Theo dõi và công bố lịch sử phát triển của sản phẩm. Changelog có 2 mặt: Một mặt dành cho Đội ngũ Kỹ thuật (Internal), Một mặt dành cho Người dùng (Public).

## Internal Changelog (Dành cho Dev & PM)
- Gắn liền với tính năng Release của GitHub.
- Tuân thủ SemVer (Semantic Versioning): `v1.0.0`
- Cấu trúc bắt buộc:
  - `[Feature]`: Tính năng mới thêm vào.
  - `[Fix]`: Lỗi đã sửa (Đính kèm Link Issue/Ticket).
  - `[Chore]`: Nâng cấp thư viện (Dependency update), Tối ưu Code.
  - `[Breaking]`: Những thay đổi làm hỏng API hoặc Database cũ (Cần chú ý đặc biệt).

## Public Changelog (Dành cho Người dùng)
- Không dùng từ ngữ kỹ thuật (Jargon).
- Hiển thị dưới dạng một trang `/changelog` hoặc Nút cái Chuông góc màn hình.
- **Ví dụ viết sai (Internal):** `[Fix] Sửa lỗi N+1 Query trên bảng Coffee_Prices gây Timeout API`.
- **Ví dụ viết đúng (Public):** `[Cải thiện] Tối ưu tốc độ tải Bảng giá nhanh gấp 3 lần vào giờ cao điểm`.
- Mỗi cập nhật lớn nên kèm theo Ảnh chụp màn hình (Screenshot) hoặc một bức ảnh GIF ngắn mô tả tính năng.
