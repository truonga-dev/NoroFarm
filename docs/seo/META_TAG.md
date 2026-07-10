# Thẻ Siêu Dữ Liệu (Meta Tags)

## Mục tiêu
Định nghĩa cách Frontend (Next.js) sinh ra (Generate) các thẻ HTML `<title>` và `<meta>` cho từng trang. Đây là yếu tố On-page quan trọng nhất quyết định việc Google hiển thị kết quả tìm kiếm (SERP) như thế nào.

## Tiêu chuẩn Thẻ Tiêu đề (Title Tag)
- **Cấu trúc:** `[Tiêu đề trang] | [Từ khóa phụ nếu có] - NoroFarm`.
- **Ví dụ:** `Giá Cà Phê Hôm Nay | Cập Nhật Trực Tuyến - NoroFarm`.
- **Độ dài:** Tuyệt đối giữ trong khoảng **50 - 60 ký tự**. Dài hơn sẽ bị Google cắt cụt bằng dấu `...`.
- **Nguyên tắc:** Phải chứa từ khóa chính (Keyword) ở phần đầu của chuỗi. Mỗi trang phải có một Tiêu đề duy nhất (Unique).

## Tiêu chuẩn Thẻ Mô tả (Meta Description)
- **Độ dài:** Khuyến nghị từ **150 - 160 ký tự**.
- **Chức năng:** Không trực tiếp giúp tăng thứ hạng (Ranking factor), nhưng quyết định tỷ lệ nhấp chuột (CTR). Phải được viết dưới dạng một đoạn quảng cáo hấp dẫn (Call to Action).
- **Ví dụ:** `Xem giá cà phê Robusta và Arabica hôm nay tại Tây Nguyên. Bảng giá được cập nhật liên tục mỗi 5 phút từ các sàn giao dịch London và New York.`

## Canonical Tag
- **Mục tiêu:** Chống trùng lặp nội dung (Duplicate Content). Nếu hệ thống có thể truy cập 1 bài viết bằng 2 URL khác nhau (Vd: `/tin-tuc/gia-ca-phe` và `/tin-tuc/gia-ca-phe?source=facebook`), Google sẽ phạt.
- **Thực thi:** Mọi trang BẮT BUỘC phải có thẻ `<link rel="canonical" href="https://norofarm.com/URL-GỐC" />`.

## Cấu trúc URL (URL Slug)
- Mọi URL phải được định dạng bằng chữ thường (Lowercase), không dấu, ngăn cách bằng dấu gạch ngang (Kebab-case).
- **Sai:** `norofarm.com/Giá_Cà_Phê_2026`
- **Đúng:** `norofarm.com/gia-ca-phe-2026`
