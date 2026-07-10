# Tối ưu SEO Hình ảnh (Image SEO)

## Mục tiêu
Hình ảnh không chỉ làm đẹp Web mà còn là một nguồn Traffic khổng lồ từ **Google Image Search**. Nếu tối ưu tốt, hàng nghìn người có thể truy cập NoroFarm khi tìm kiếm "Biểu đồ giá cà phê".

## Tên File (Filename)
- Tuyệt đối không upload ảnh có tên `IMG_0001.jpg` hoặc `image-123.jpg`.
- Bắt buộc đổi tên file theo từ khóa trước khi upload (CMS phải có tính năng này, hoặc Admin tự đổi tay).
- **Đúng:** `bieu-do-gia-ca-phe-robusta-thang-10.jpg`.

## Thuộc tính Alt Text (Văn bản thay thế)
- Thẻ `<img alt="...">` là Yếu tố quan trọng nhất. Googlebot không có mắt để nhìn ảnh, nó đọc thuộc tính Alt để hiểu ảnh vẽ gì.
- Alt text còn giúp người khiếm thị đọc màn hình.
- Mọi hình ảnh (trừ Icon trang trí) đều BẮT BUỘC phải có Alt text. Nếu Admin quên nhập Alt, Frontend cảnh báo đỏ hoặc tự động lấy Tiêu đề bài viết bù vào.

## Thuộc tính Title
- Khác với Alt, Title `<img title="...">` hiển thị như một Tooltip khi người dùng di chuột (Hover) qua ảnh. Nên tận dụng để bổ sung thông tin.

## Định dạng & Responsive
- Tránh dùng PNG cho ảnh đời thực vì quá nặng. 
- Mặc định dùng `next/image` của Next.js để tự động chuyển sang WebP/AVIF và sinh ra thuộc tính `srcset`, giúp điện thoại màn nhỏ chỉ tải ảnh nhỏ, tiết kiệm băng thông.
