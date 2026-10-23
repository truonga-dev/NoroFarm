# NoroFarm — Giai đoạn 1: Khám phá sản phẩm giao dịch nông sản B2B

**Bắt đầu:** 23/10/2026  
**Trạng thái:** Khảo sát nội bộ đã khởi động; chưa có phỏng vấn người dùng thực.  
**Nguồn quyết định:** Chủ dự án xác nhận ưu tiên thương lái/doanh nghiệp giao dịch trong 6 tháng tới và mong muốn hỗ trợ toàn bộ quy trình: tìm đối tác, báo giá, đặt hàng, hợp đồng, thanh toán. Hiện chưa có người tham gia nghiên cứu.

> Tài liệu này là kế hoạch khám phá trải nghiệm và nghiệp vụ, không phải đặc tả tính năng đã xác nhận. Mọi nhu cầu suy ra từ mã nguồn, tài liệu UX hoặc ảnh chụp đều được coi là giả thuyết cho đến khi có bằng chứng thực địa.

## 1. Mục tiêu và ranh giới

Tìm hiểu cách một giao dịch nông sản thực tế diễn ra từ **nhu cầu mua/bán → tìm đối tác → thẩm định lô hàng → thương lượng/báo giá → chốt đơn và hợp đồng → giao nhận → thanh toán → xử lý tranh chấp**. Từ đó quyết định NoroFarm nên phục vụ vai trò nào trước, xử lý bước nào trên nền tảng và cần năng lực vận hành nào ở ngoài giao diện.

Giá thị trường, thời tiết và tin tức là thông tin hỗ trợ quyết định giao dịch; không mặc định là sản phẩm lõi. Phạm vi thiết kế đầu tiên chưa được chốt cho đến khi hiểu luồng giao dịch và năng lực pháp lý/vận hành. Không thiết kế màn hình thanh toán hoặc cam kết đảm bảo giao dịch khi chưa xác định đối tác thanh toán, trách nhiệm và quy trình đối soát.

### Câu hỏi quyết định cấp sản phẩm

1. Loại giao dịch ưu tiên là mặt hàng, vùng, quy mô và mô hình nào (lô hàng sẵn có, đặt trước mùa vụ, hay hợp đồng cung ứng)?
2. Ai là người mua, người bán, người duyệt, người vận chuyển và người thanh toán trong từng tổ chức? Một tài khoản có đại diện cho công ty không?
3. NoroFarm là nơi đăng tin và tạo lead, môi giới giao dịch, hay bên cung cấp quy trình đặt hàng/hợp đồng/thanh toán? **Đích dài hạn đã xác nhận là toàn quy trình; thứ tự triển khai vẫn cần quyết định.**
4. Đối tác được xác minh thế nào, giá/chất lượng/số lượng được chứng minh ra sao, ai chịu trách nhiệm khi sai lệch hoặc tranh chấp?
5. Hợp đồng điện tử, hóa đơn, đặt cọc, thanh toán, hoàn tiền và đối soát sẽ do đơn vị nào thực hiện và chịu trách nhiệm? Cần tư vấn pháp lý và đối tác nghiệp vụ trước khi định nghĩa luồng chính thức.

## 2. Khảo sát nội bộ — bằng chứng hiện có

| Quan sát từ dự án | Ý nghĩa cần kiểm chứng |
| --- | --- |
| `docs/ux/PERSONAS.md`, `USER_JOURNEY.md`, `USER_STORIES.md` mô tả nông dân, thương lái, nhà phân tích; chưa có chân dung cụ thể cho bộ phận thu mua doanh nghiệp, người duyệt và vận hành giao dịch. | Bổ sung vai trò B2B dựa trên phỏng vấn, không chỉ đổi nhãn persona. Các con số/nhu cầu trong tài liệu cũ hiện là giả định. |
| `backend/app/models/market.py` và `backend/app/schemas/market.py` có bài đăng mua/bán, trạng thái duyệt và trường giá, lượng, đơn vị, địa điểm, số liên hệ. | Chưa thấy mô hình báo giá, phiên bản thương lượng, hợp đồng, giao nhận, thanh toán hay hồ sơ xác minh lô hàng. Cần lập bản đồ dữ liệu cho toàn giao dịch. |
| `frontend/src/middleware.ts` yêu cầu đăng nhập cho `/marketplace`; `frontend/src/app/dashboard/my-posts/page.tsx` giới hạn quyền đăng bài cho `seller`/`admin`. | Kiểm chứng bước nào nên công khai, bước nào cần định danh; quy trình cấp quyền người bán có đủ tin cậy và nhanh không. |
| `frontend/src/components/market/create-post-modal.tsx` thu thập thông tin lô khá ngắn; form gửi `content` trong khi schema API dùng `description`. | Kiểm tra hợp đồng API và thử tạo bài đăng để xác nhận có mất nội dung hay không. Đây là phát hiện kỹ thuật cần xác minh, chưa phải kết luận từ người dùng. |
| `frontend/src/app/checkout/page.tsx` là luồng cửa hàng, chưa rõ quan hệ với bài đăng chợ B2B. | Quyết định hợp nhất hay tách sản phẩm/cửa hàng với giao dịch lô hàng, tránh hai luồng đặt hàng mâu thuẫn. |
| `docs/ux/ERROR_HANDLING.md` nói đến giá offline; `frontend/public/sw.js` hiện chỉ xử lý push notification. | Không hứa khả năng offline trên giao diện cho đến khi được triển khai và đo kiểm. |
| Ảnh người dùng cung cấp cho thấy nhiều giá `N/A`, thời tiết không rõ nguồn/cập nhật và ảnh tin tức lỗi. | Kiểm chứng độ tin cậy dữ liệu, thời điểm cập nhật, nguồn, trạng thái thiếu dữ liệu và ảnh hưởng tới quyết định mua bán. |

**Lưu ý:** Các vấn đề giao diện/hiệu năng đã nêu ở các lượt trước là tín hiệu cần đánh giá. Giai đoạn này không tự coi screenshot là bằng chứng về nhu cầu nghiệp vụ B2B.

## 3. Giả thuyết nghiên cứu, chưa được xác nhận

| Mã | Giả thuyết | Cách kiểm chứng |
| --- | --- | --- |
| H1 | Người mua cần lọc theo vùng, số lượng, phẩm cấp, thời điểm giao và chứng nhận trước khi liên hệ. | Phỏng vấn giao dịch gần nhất; quan sát họ chọn giữa các lô mẫu, hỏi bằng chứng nào là bắt buộc. |
| H2 | Độ tin cậy đối tác và khả năng xác minh lô hàng quan trọng hơn biểu đồ giá dày đặc. | Yêu cầu xếp hạng yếu tố quyết định và mô tả giao dịch thất bại gần nhất. |
| H3 | Doanh nghiệp cần nhiều người tham gia phê duyệt báo giá/hợp đồng. | Vẽ sơ đồ vai trò và quyền ký từ 2–3 doanh nghiệp thật. |
| H4 | Giá tham chiếu chỉ hữu ích nếu có đơn vị, vùng, nguồn, thời điểm và mức độ xác thực. | Cho đánh giá một trang giá có/không có metadata; ghi cách họ dùng giá khi thương lượng. |
| H5 | Liên hệ ngoài nền tảng là thói quen mạnh; muốn giữ người dùng trong luồng phải có lợi ích rõ như lưu lịch sử, tài liệu, đối soát. | Hỏi về kênh liên lạc thực tế và vì sao họ rời nền tảng. |
| H6 | Quy trình đặt cọc, hợp đồng và thanh toán khác nhau theo mặt hàng/quy mô. | So sánh ít nhất ba giao dịch thực, thu thập biểu mẫu đã ẩn thông tin nhạy cảm nếu được đồng ý. |

## 4. Tuyển người tham gia

**Hiện trạng:** 0 người đã xác nhận. Không ghi nhận phỏng vấn hay kết luận định lượng giả. Đề xuất vòng định tính đầu tiên **8–10 người**: 3 thương lái, 3 người thu mua/doanh nghiệp, 2 nhà bán hàng/hợp tác xã, 1–2 người phụ trách vận hành/duyệt giao dịch. Đây là mẫu có chủ đích để tìm mẫu hành vi và vấn đề, không đại diện thống kê. Nếu không tuyển được đủ, ghi rõ khoảng trống từng vai trò và không chốt phạm vi thay họ.

**Kênh tuyển gợi ý (chưa liên hệ):** đối tác/hợp tác xã hiện có của chủ dự án, người dùng thật của sản phẩm nếu có và đồng ý được mời, hiệp hội/ngành hàng, mạng lưới thu mua tại vùng ưu tiên. Không dùng nhân viên nội bộ thay thế người mua/bán thực. Nên có cả người ít dùng công nghệ và người thường giao dịch qua điện thoại/Zalo.

**Sàng lọc:** vai trò, loại hình tổ chức, mặt hàng, tỉnh/vùng, số giao dịch trong 3 tháng gần đây, quy mô lô, kênh tìm đối tác, thiết bị thường dùng, quyền quyết định/duyệt, khả năng tham gia 45 phút. Không thu thập dữ liệu nhận dạng hoặc chứng từ giao dịch thật nếu chưa có đồng ý rõ ràng; ẩn tên, số điện thoại, giá hợp đồng nhạy cảm trong ghi chép.

**Mời tham gia — mẫu ngắn:** “NoroFarm đang nghiên cứu cách doanh nghiệp và thương lái mua bán nông sản. Chúng tôi muốn tìm hiểu một giao dịch bạn đã thực hiện gần đây trong buổi trao đổi 45 phút; đây không phải buổi bán hàng. Bạn có thể từ chối câu hỏi hoặc ngừng bất kỳ lúc nào. Chúng tôi chỉ ghi âm khi được bạn đồng ý.”

## 5. Kịch bản nghiên cứu

### Phỏng vấn bối cảnh — 45 phút/người

1. **5 phút:** giới thiệu mục đích, quyền từ chối, xin đồng ý ghi chép/ghi âm riêng.
2. **15 phút:** “Hãy kể lại lần mua/bán nông sản gần nhất, từ lúc xuất hiện nhu cầu tới lúc nhận tiền/hàng.” Hỏi ai tham gia, công cụ/tài liệu đã dùng, lúc nào thay đổi quyết định. Ưu tiên hành vi đã xảy ra, không hỏi “bạn có muốn tính năng X không?”.
3. **10 phút:** đi sâu vào tìm đối tác, đánh giá chất lượng và giá, xác minh danh tính, thương lượng, đặt cọc, giao nhận, hóa đơn/hợp đồng, tranh chấp. Hỏi một trường hợp trục trặc cụ thể.
4. **10 phút:** giao nhiệm vụ trên giao diện hiện tại hoặc bản mẫu giấy, quan sát người tham gia tự diễn giải. Không hướng dẫn click, không giải thích ý nghĩa của thành phần trước khi họ thử.
5. **5 phút:** hỏi điều gì thiếu khiến họ chưa thể dùng sản phẩm cho một giao dịch thật; xác nhận tóm tắt và xin phép liên hệ vòng sau.

### Nhiệm vụ thử trên sản phẩm hiện tại

- Người mua: tìm lô phù hợp mặt hàng/vùng/lượng; nêu thông tin còn thiếu trước khi gọi cho người bán.
- Người bán: tạo đề nghị bán và cho biết cần tải bằng chứng gì để người mua tin tưởng.
- Hai phía: so sánh hai đề nghị, yêu cầu báo giá, xác định ai có quyền chốt và bước tiếp theo.
- Vận hành: xét duyệt một bài đăng có dữ liệu thiếu hoặc đáng ngờ; giải thích căn cứ quyết định.

Ghi **hoàn thành/không hoàn thành**, thời gian tương đối, điểm dừng, câu hỏi người dùng đặt ra, thông tin họ phải tìm ngoài sản phẩm, lỗi kỹ thuật và mức độ tin cậy được diễn đạt bằng lời. Không đặt KPI tốc độ click hoặc tỉ lệ thành công trước khi có baseline và thử nghiệm.

### Câu hỏi riêng cho chủ dự án/đội vận hành

- Mặt hàng/vùng/quy mô giao dịch đầu tiên; nguồn cung và cầu sẵn có; doanh thu dự kiến từ đâu?
- Ai kiểm duyệt bài đăng, xác minh doanh nghiệp/lô, xử lý khiếu nại; năng lực xử lý mỗi ngày?
- Có đối tác hợp đồng điện tử, thanh toán, vận chuyển, hóa đơn, kiểm định không? Ai chịu trách nhiệm nếu giao dịch thất bại?
- Dữ liệu giá/thời tiết từ nguồn nào, quyền sử dụng, tần suất cập nhật và mức độ đảm bảo?
- Trong 6 tháng, chỉ số thành công là lead đủ điều kiện, báo giá, đơn được chốt, giá trị giao dịch, hay doanh thu? Định nghĩa và cách đo từng chỉ số.

## 6. Tổ chức và tiêu chí kết thúc giai đoạn

**Tuần khởi động:** thống nhất câu hỏi kinh doanh, chọn một ngành hàng/vùng thử, lập danh sách mời và kiểm tra luồng hiện tại; ghi rõ lỗi/thiếu dữ liệu kỹ thuật. **Sau khi tuyển được người:** thực hiện 8–10 buổi định tính, tổng hợp theo vai trò và hành trình. **Vòng xác nhận:** thử 1–2 luồng ưu tiên bằng prototype với người tham gia khác hoặc người đã phỏng vấn nếu không có mẫu mới; ghi hạn chế của mẫu.

Đầu ra phải có: chân dung vai trò B2B có bằng chứng, bản đồ hành trình và service blueprint (bao gồm vận hành ngoài màn hình), danh sách rủi ro/trách nhiệm, hợp đồng dữ liệu tối thiểu cho một giao dịch, cấu trúc thông tin ưu tiên và backlog có mức độ tin cậy. Mỗi yêu cầu phải trỏ tới bằng chứng hoặc được gắn nhãn **giả thuyết**. Chỉ chốt phạm vi giao diện giai đoạn 2 khi đã chọn luồng giao dịch đầu tiên, có ý kiến từ cả phía mua và bán, làm rõ khả năng vận hành/pháp lý cho phần giao dịch được chọn, và có tiêu chí đo thành công.

**Chưa đạt điều kiện kết thúc:** hiện không có người tham gia; đích “toàn quy trình” là tầm nhìn, không đồng nghĩa có thể thiết kế/xây dựng an toàn tất cả bước ngay một lượt.

## 7. Mẫu ghi chép và nhật ký quyết định

Cho mỗi buổi: mã ẩn danh, vai trò/vùng/ngành hàng, giao dịch gần nhất, từng bước thực tế, công cụ đang dùng, vấn đề và hậu quả, trích dẫn ngắn được đồng ý, quan sát thao tác, ý tưởng nảy sinh, câu hỏi mở. Tách rõ **người tham gia nói**, **người nghiên cứu quan sát**, và **diễn giải**. Không lưu tài liệu gốc có thông tin nhạy cảm vào repository.

Cho mỗi quyết định thiết kế: vấn đề, đối tượng, bằng chứng (mã buổi/quan sát), phương án, rủi ro, người quyết định, ngày, trạng thái cần xác minh. Mọi kết luận từ một người cần ghi rõ mức độ tin cậy thấp.

## 8. Bản đồ năng lực hiện tại và lát cắt phát triển đề xuất

Đây là **bản đồ từ mã nguồn**, không xác nhận quy trình nghiệp vụ thực tế. `MarketPost` là tin mua/bán có kiểm duyệt; `Order` và `PaymentTransaction` thuộc cửa hàng sản phẩm riêng. Chưa có liên kết giữa bài đăng và báo giá/đơn hàng B2B. Vì vậy giao diện hiện có không được mô tả như một hệ thống giao dịch B2B trọn vẹn.

| Bước giao dịch | Hiện có trong mã nguồn | Khoảng trống cần quyết định/kiểm chứng |
| --- | --- | --- |
| Tìm nguồn hàng/nhu cầu mua | Danh sách bài đăng, lọc loại tin/mặt hàng/từ khóa, kiểm duyệt | Vùng, phẩm cấp, thời điểm giao, tính sẵn có, cách xác minh và công khai thông tin liên hệ |
| Liên hệ và báo giá | Số điện thoại trên tin đăng | Yêu cầu báo giá có cấu trúc, lịch sử thương lượng, ai được xem dữ liệu, hết hạn báo giá |
| Chốt đơn | Đơn hàng cho sản phẩm cửa hàng, không tham chiếu `MarketPost` | Xác nhận hai phía, số lượng thực, biến động giá, điều kiện giao nhận, hủy/đổi |
| Hợp đồng | Chưa thấy mô hình hợp đồng B2B | Mẫu điều khoản, phiên bản, người có thẩm quyền ký, lưu trữ, tư vấn pháp lý |
| Vận chuyển/nhận hàng | Trạng thái giao hàng của đơn cửa hàng | Bàn giao, kiểm định, thiếu hụt, chứng từ, đối soát thực nhận |
| Thanh toán | Stripe session/webhook cho đơn cửa hàng | Phương thức phù hợp giao dịch B2B, đặt cọc, thanh toán nhiều đợt, hoàn tiền, đối soát, trách nhiệm pháp lý |
| Hậu mãi/tranh chấp | Chưa thấy luồng gắn với bài đăng | Bằng chứng, thời hạn phản hồi, phân xử, quyền truy cập và lưu giữ dữ liệu |

**Lát cắt đề xuất, chưa cam kết xây dựng:**

1. **Nền tin cậy và dữ liệu lô hàng:** sửa lỗi hợp đồng API hiện hữu; xác định trường tối thiểu, trạng thái dữ liệu, quyền truy cập và nguồn xác minh. Đây là nền cho mọi bước sau.
2. **Yêu cầu báo giá có cấu trúc:** chỉ thiết kế khi xác nhận cách hai phía thương lượng thật và phạm vi dữ liệu cần giữ trên nền tảng. Mục tiêu là đo được một cơ hội giao dịch đủ điều kiện.
3. **Đơn B2B và hợp đồng:** cần xác nhận vai trò tổ chức, điều khoản, quyền duyệt/ký, trách nhiệm vận hành. Không dùng lại đơn cửa hàng chỉ vì đã có bảng `orders`.
4. **Thanh toán và đối soát:** chỉ tiến hành sau khi có đối tác/quy trình phù hợp, đánh giá pháp lý, mô hình xử lý sai lệch và thử nghiệm bảo mật. Không suy từ việc tích hợp Stripe B2C rằng B2B đã sẵn sàng.

**Việc kỹ thuật có bằng chứng trực tiếp:** biểu mẫu đăng tin từng gửi `content` trong khi `MarketPostCreate` nhận `description`; đã đồng bộ frontend vào `description`. API chi tiết công khai trước đây lấy bài theo ID không xét trạng thái; nay chỉ trả bài đang hoạt động và đã duyệt. `MarketPostResponse` trước đây lồng `UserResponse` (gồm email và số điện thoại hồ sơ); nay chỉ trả ID và tên hiển thị tác giả. Số liên hệ được nhập trực tiếp trên tin vẫn công khai theo hành vi cũ; cần kiểm chứng đồng ý chia sẻ và chính sách quyền riêng tư trước khi mở rộng. TypeScript đã kiểm tra; vẫn cần kiểm thử backend và luồng thực trong môi trường chạy được.

## Tham khảo phương pháp

- [GOV.UK Service Manual — Discovery phase](https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works): khám phá vấn đề, người dùng, hành trình và ràng buộc trước khi cam kết giải pháp.
- [GOV.UK Service Manual — Plan user research](https://www.gov.uk/service-manual/user-research/plan-user-research-for-your-service): tuyển người phù hợp, đa dạng và nghiên cứu theo vòng nhỏ.
- [W3C — WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum): yêu cầu kích thước/vùng cách nút; 48px trong tài liệu UX cũ là mục tiêu sản phẩm, không phải ngưỡng WCAG AA bắt buộc.

Tài liệu kế hoạch kỹ thuật [`2026-10-23-production-readiness-features.md`](2026-10-23-production-readiness-features.md) có cách đánh số giai đoạn riêng; không thay thế giai đoạn khám phá nghiệp vụ này.
