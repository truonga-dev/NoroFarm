# Thiết kế: Trang Giới thiệu (About Us)

## 1. Mục tiêu
Truyền tải tầm nhìn, sứ mệnh của NoroFarm, xây dựng lòng tin với người dùng, đối tác và nhà đầu tư. Thiết kế cần mang tính "Corporate" nhưng vẫn giữ được nét khởi nghiệp năng động, hiện đại.

## 2. Bố cục (Layout)
Trang được chia thành các khối (Block) liền mạch:
1. **Hero Section (Sứ mệnh):** Tiêu đề lớn, câu slogan ấn tượng ở chính giữa màn hình. Phía sau là một tấm ảnh chất lượng cao hoặc video background về nông nghiệp Việt Nam (làm tối đi 50% bằng overlay).
2. **Khối Giá trị Cốt lõi (Values):** Lưới 3 cột (Bento box hoặc Card đơn giản), mỗi cột có 1 icon lớn, 1 tiêu đề và mô tả ngắn (VD: Nhanh chóng, Chính xác, Miễn phí).
3. **Khối Đội ngũ (Team):** Danh sách các thành viên chủ chốt. Ảnh profile hình vuông góc bo tròn (`rounded-2xl`) hoặc tròn hoàn toàn, kèm chức danh.
4. **Khối Đối tác (Partners / Logos):** Dải băng chuyền (Marquee) logo các đơn vị đối tác, báo chí hoặc nguồn dữ liệu (màu xám nhạt, đổi màu khi hover).

## 3. Typography & Spacing
- Sử dụng phông chữ lớn, tự tin.
- **Spacing:** Khoảng cách giữa các phần trong trang About rất rộng (`py-24` hoặc `py-32`) để tách biệt nội dung, cho người đọc thời gian "thở" và tiêu hóa thông tin.

## 4. Animation
- Kéo cuộn (Scroll Animation): Khi cuộn xuống, các khối Giá trị hoặc Avatar đội ngũ sẽ trượt nhẹ từ dưới lên (Fade in up).
- Dải băng đối tác: Auto-scroll mượt mà, vô tận.
