# Kế hoạch thiết kế lại giao diện NoroFarm

## 1. Mục tiêu

Thiết kế lại toàn bộ khung giao diện NoroFarm theo hướng:

- Tin cậy, gần gũi với nông nghiệp Việt Nam, dễ đọc và dễ thao tác.
- Tốt hơn rõ rệt về phân cấp thông tin, khả năng quét dữ liệu và tính nhất quán.
- Không chạy theo phong cách futuristic, glassmorphism nặng, gradient dày hoặc hiệu ứng phô trương.
- Không dùng hình ảnh hay biểu tượng gợi AI như sparkle, wand, robot, brain, circuit và magic stars.
- Phục vụ tốt ba nhóm trải nghiệm: khách truy cập, người dùng đã đăng nhập và quản trị viên.
- Giữ nguyên luồng nghiệp vụ/API hiện có trong giai đoạn đầu; redesign UI không làm thay đổi hành vi lõi.

## 2. Định hướng hình ảnh

### 2.1 Tính cách thương hiệu

Ba từ khóa: **đáng tin — thực tế — bản địa**.

Giao diện nên giống một cổng dữ liệu và thương mại nông nghiệp trưởng thành, không giống sản phẩm AI hoặc dashboard tài chính quá công nghệ. Cảm giác thị giác lấy từ giấy thông tin thị trường, bảng giá nông sản, bản đồ canh tác và vật liệu tự nhiên.

### 2.2 Ngôn ngữ thị giác

- Nền chính: trắng ngà hoặc xanh rất nhạt, tránh trắng xanh lạnh hoàn toàn.
- Xanh thương hiệu: xanh lá trầm, dùng cho hành động chính và trạng thái được chọn.
- Màu phụ: đất nung, vàng lúa và nâu ấm với tỷ lệ nhỏ.
- Màu dữ liệu: xanh tăng, đỏ giảm, xám đứng giá; không dùng màu thương hiệu để biểu diễn tăng/giảm.
- Card phẳng, viền rõ, bóng rất nhẹ; hạn chế card lồng card.
- Bo góc vừa phải: 8–12px cho phần lớn thành phần, 16px chỉ cho khối lớn.
- Ảnh thật về nông sản, mùa vụ và người sản xuất; tránh illustration 3D và ảnh tổng hợp mang phong cách AI.
- Đường kẻ, nhãn, bảng và số liệu được ưu tiên hơn mảng gradient trang trí.

### 2.3 Chính sách icon

Tiếp tục dùng Lucide nhưng chỉ dùng icon chức năng hoặc đúng ngữ cảnh.

Được dùng:

- Điều hướng: Home, Newspaper, CloudSun, ShoppingBag, Store, User.
- Dữ liệu: TrendingUp, TrendingDown, BarChart, Calendar, MapPin, Download.
- Nông nghiệp: Sprout, Wheat, Coffee, Leaf khi thật sự mô tả nội dung.
- Hành động: Search, Filter, Plus, Edit, Trash, Refresh, Chevron.

Không dùng:

- Sparkles, Wand, Bot, Brain, Cpu, CircuitBoard để tạo cảm giác “thông minh”.
- Icon trang trí đứng một mình không bổ sung ý nghĩa.
- Nhiều màu icon tùy ý trong cùng một nhóm menu.

Quy tắc: icon chức năng luôn có nhãn hoặc `aria-label`; icon trang trí phải ẩn khỏi screen reader.

## 3. Các vấn đề hiện tại cần giải quyết

1. Header desktop có quá nhiều mục ngang, hành động phụ và menu tài khoản cùng cạnh tranh sự chú ý.
2. Khung public, dashboard người dùng và admin chưa cùng một hệ layout; dashboard người dùng chưa có navigation riêng rõ ràng.
3. Mật độ, radius, shadow và khoảng cách khác nhau giữa các trang dù cùng loại nội dung.
4. Trang dữ liệu đang dùng nhiều card lớn; bảng giá cần ưu tiên khả năng so sánh theo hàng và cột.
5. Bộ lọc, thanh công cụ, loading, empty state và error state được dựng riêng ở nhiều trang.
6. Một số nội dung “2026” được lặp quá mức trong label và CTA, làm giao diện nhanh lỗi thời.
7. Các khối landing page tương đối nhiều, khiến trang chủ dài và thiếu trọng tâm chuyển đổi.
8. Admin sidebar cố định 256px và content `pl-64`, chưa tạo khung responsive tốt cho tablet/mobile.
9. Dark mode hiện nghiêng về slate/tech; cần chuyển sang charcoal/xanh đen ấm và giữ độ tương phản dữ liệu.
10. Tài liệu thiết kế hiện tại hướng tới phong cách “enterprise hiện đại” nhưng chưa phản ánh rõ cá tính nông nghiệp bản địa.

## 4. Kiến trúc thông tin mới

### 4.1 Điều hướng công khai

Header chính chỉ giữ 5 điểm vào:

1. Giá nông sản
2. Thời tiết
3. Giao thương
4. Vật tư
5. Tin & kiến thức

Trong đó:

- “Giá nông sản” chứa tổng hợp giá, cà phê và trang chi tiết mặt hàng.
- “Giao thương” dẫn tới sàn B2B.
- “Vật tư” dẫn tới cửa hàng B2C.
- About, Contact, Privacy và Terms chuyển xuống footer.
- Search, cart, notification và account nằm trong nhóm tiện ích bên phải.

### 4.2 Điều hướng người dùng

Dashboard có shell riêng:

- Tổng quan
- Cảnh báo giá
- Đã lưu / danh mục theo dõi
- Tin đăng của tôi
- Đơn hàng
- Cài đặt tài khoản

Desktop dùng sidebar hẹp 232–248px. Mobile dùng tiêu đề trang + drawer; không dùng bottom navigation nếu số mục vượt quá 5.

### 4.3 Điều hướng quản trị

Nhóm menu theo nghiệp vụ thay vì danh sách dài:

- Tổng quan
- Nội dung: tin tức, liên hệ
- Thị trường: giá, cà phê, sàn B2B
- Thương mại: sản phẩm, đơn hàng
- Người dùng: tài khoản, nhật ký
- Hệ thống: cài đặt

Sidebar có thể thu gọn nhưng icon luôn đi kèm tooltip. Trên mobile chuyển thành drawer.

## 5. Design foundation

### 5.1 Màu đề xuất

| Token | Light | Dark | Vai trò |
|---|---:|---:|---|
| Background | `#FAFBF7` | `#111713` | Nền trang |
| Surface | `#FFFFFF` | `#18201B` | Card, popover |
| Surface subtle | `#F2F5EE` | `#202A23` | Khu vực phụ |
| Text | `#18221B` | `#F2F5EE` | Nội dung chính |
| Text muted | `#617066` | `#AAB6AD` | Nội dung phụ |
| Border | `#DCE4DA` | `#344039` | Viền |
| Primary | `#25633E` | `#70B98B` | CTA, link, active |
| Primary hover | `#1D5032` | `#8AC9A0` | Hover |
| Harvest | `#B7791F` | `#D7A956` | Nhấn phụ |
| Soil | `#8A5A3B` | `#C08A68` | Nội dung bản địa |
| Positive | `#287A4B` | `#6BC38D` | Giá tăng/thành công |
| Negative | `#B5483F` | `#E68178` | Giá giảm/lỗi |
| Warning | `#A66B13` | `#E3B65C` | Cảnh báo |

Không dùng gradient cho button hoặc card. Gradient chỉ được cân nhắc ở ảnh phủ hero với opacity thấp.

### 5.2 Typography

- Sans chính: Be Vietnam Pro hoặc Inter nếu muốn giảm thay đổi kỹ thuật.
- Số liệu: dùng cùng font với `font-variant-numeric: tabular-nums`; không bắt buộc thêm mono font.
- H1 desktop 44–48px, mobile 32–36px.
- H2 desktop 30–34px, mobile 26–28px.
- Body mặc định 16px; bảng dữ liệu 14px; caption tối thiểu 12px.
- Hạn chế ExtraBold; phần lớn heading dùng 600–700 để bớt cảm giác quảng cáo.

### 5.3 Grid và spacing

- Container public tối đa 1240px; trang dữ liệu tối đa 1360px.
- Lề mobile 16px, tablet 24px, desktop 32px.
- Section public 64–80px desktop, 40–48px mobile.
- Khoảng cách component theo thang 4, 8, 12, 16, 24, 32, 48, 64.
- Card padding 16px mobile và 20–24px desktop.

### 5.4 Elevation và motion

- Card mặc định chỉ có border; shadow chỉ xuất hiện ở dropdown, dialog và card nổi khi hover.
- Hover không scale card; chỉ đổi border, nền hoặc shadow nhẹ.
- Transition 120–200ms.
- Page transition chỉ fade ngắn; bỏ chuyển động spring dài.
- Tôn trọng `prefers-reduced-motion`.

## 6. Khung giao diện dùng chung

### 6.1 Public app shell

Thứ tự từ trên xuống:

1. Announcement bar chỉ xuất hiện khi có thông báo thật.
2. Header 64px desktop, 56px mobile.
3. Market ticker tùy ngữ cảnh: chỉ ở trang chủ và nhóm giá, không xuất hiện toàn site.
4. Main content có breadcrumb ở trang cấp 2 trở lên.
5. Footer 4 cột gọn: thương hiệu, khám phá, hỗ trợ, liên hệ.

Header desktop:

- Trái: logo.
- Giữa: 5 mục điều hướng.
- Phải: search, cart, notification, account.
- Theme chuyển vào menu tài khoản hoặc footer để giảm icon cạnh tranh.
- Tài khoản chưa đăng nhập dùng một nút “Đăng nhập”; đăng ký nằm trong trang login.

Header mobile:

- Menu, logo, search và cart.
- Drawer chia nhóm rõ, mục chạm tối thiểu 44px.
- Không sao chép toàn bộ desktop menu vào một danh sách không phân nhóm.

### 6.2 Page header chuẩn

Mọi trang danh sách dùng cùng cấu trúc:

- Breadcrumb tùy chọn.
- Eyebrow ngắn nếu cần.
- H1 + mô tả tối đa 2 dòng.
- Primary action và secondary action đặt bên phải desktop, xuống dưới ở mobile.
- Metadata cập nhật dữ liệu nằm dưới mô tả, không nhét vào CTA.

### 6.3 Toolbar chuẩn

Một component chung cho search, filter, sort, view switch và result count:

- Desktop: một hàng, search bên trái, controls bên phải.
- Mobile: search toàn chiều rộng; filter mở bottom sheet; sort là select.
- Toolbar sticky chỉ dùng cho danh sách dài như giá, shop, marketplace.
- Filter đang áp dụng hiển thị bằng chip có thể xóa.

### 6.4 Data display

- Desktop ưu tiên table cho bảng giá; card là lựa chọn phụ.
- Cột số căn phải và dùng tabular nums.
- Header table sticky, row hover nhẹ, sorting state rõ.
- Mobile chuyển mỗi hàng thành compact list row, không ép bảng ngang quá rộng.
- Biểu đồ luôn có summary số liệu, legend và tooltip dễ đọc.

### 6.5 Trạng thái hệ thống

Chuẩn hóa 5 trạng thái cho mọi module:

- Loading: skeleton đúng kích thước nội dung.
- Empty: tiêu đề, giải thích, một hành động hợp lý; icon đơn giản.
- No results: giữ bộ lọc và cung cấp “Xóa bộ lọc”.
- Error: giải thích ngắn + Retry; không hiển thị exception kỹ thuật.
- Offline/stale: hiển thị dữ liệu gần nhất và thời gian cập nhật nếu có.

## 7. Kế hoạch chi tiết theo khu vực

### 7.1 Trang chủ

Mục tiêu: trong 5 giây, người dùng hiểu NoroFarm cung cấp giá, thời tiết và giao thương.

Thứ tự đề xuất:

1. Market ticker gọn.
2. Hero hai cột: thông điệp + hai CTA; cột phải là snapshot giá/thời tiết thực, không dùng illustration AI.
3. Ba lối vào chính: Xem giá, Xem thời tiết, Đăng tin giao thương.
4. Bảng giá nổi bật 6–8 mặt hàng ở dạng compact rows.
5. Cảnh báo thời tiết theo địa phương.
6. Tin giao thương mới.
7. Tin & kiến thức mới.
8. CTA đăng ký nhận cảnh báo.

Loại bỏ hoặc gộp các section trùng thông điệp như Features và Why choose us. Tổng trang chủ nên còn 6–8 section có mục đích rõ.

### 7.2 Giá nông sản tổng hợp

- Header gồm tiêu đề, lần cập nhật gần nhất, Xuất CSV và Đồng bộ.
- Summary bar gồm tăng/đứng/giảm và mặt hàng biến động mạnh; không dùng ba card quá cao.
- Desktop mặc định table; grid là tùy chọn.
- Category dùng select/chip có cuộn, nhưng không đẩy toàn bộ danh mục lên nhiều dòng.
- Cột: Mặt hàng, khu vực, giá hiện tại, đơn vị, thay đổi, cập nhật, hành động.
- Mobile: row gồm tên + giá + thay đổi; chi tiết mở bằng tap.
- Nút đồng bộ chỉ hiện cho vai trò được phép; người dùng thường chỉ thấy trạng thái cập nhật.

### 7.3 Trang cà phê và chi tiết mặt hàng

- Cà phê dùng cùng shell và component với giá tổng hợp, chỉ khác preset danh mục.
- Trang chi tiết có: giá hiện tại, thay đổi, khoảng cao/thấp, khu vực, lịch sử giá, nguồn/cập nhật.
- Biểu đồ nằm sau summary, có selector 7 ngày/30 ngày/90 ngày.
- Cảnh báo giá là CTA chính cho người đăng nhập.
- Nội dung giải thích xu hướng là văn bản biên tập, không gắn nhãn AI.

### 7.4 Thời tiết

- Ưu tiên địa điểm và thời điểm cập nhật trên cùng.
- Khối hiện tại: nhiệt độ, trạng thái, mưa, gió, độ ẩm.
- Dự báo 7 ngày dùng compact forecast rows/cards đồng nhất.
- Cảnh báo nông vụ đặt ngay sau thời tiết hiện tại, phân cấp theo mức độ.
- Lựa chọn cây trồng là filter ngữ cảnh, không biến thành wizard.
- Geolocation thất bại phải có lựa chọn tỉnh thủ công ngay tại chỗ.

### 7.5 Sàn B2B / Marketplace

- Tách rõ “Cần mua” và “Cần bán” bằng filter và nhãn văn bản, không chỉ dựa vào màu.
- Card/list hiển thị: loại tin, mặt hàng, số lượng, địa điểm, thời gian, trạng thái xác minh.
- CTA “Đăng tin” cố định trong page header; mobile có sticky action cuối màn hình nếu cần.
- Trang chi tiết chia hai cột: nội dung giao dịch và thông tin liên hệ/người đăng.
- Thêm trust cues: ngày tham gia, số tin, trạng thái xác thực; không dùng điểm số giả.

### 7.6 Cửa hàng vật tư và checkout

- Header shop đơn giản, bộ lọc category/price/stock ở sidebar desktop và sheet mobile.
- Product card giảm chiều cao, ảnh tỷ lệ nhất quán, giá và tình trạng hàng dễ quét.
- Công cụ ước lượng vật tư chuyển thành khối trợ giúp riêng, không đặt trước danh sách sản phẩm nếu làm phân tán nhiệm vụ mua hàng.
- Floating cart chỉ hiện mobile; desktop dùng cart trong header và toast khi thêm hàng.
- Product detail có gallery, thông tin kỹ thuật, tồn kho, giao hàng và CTA mua rõ.
- Checkout chia ba vùng: thông tin nhận hàng, phương thức thanh toán, tóm tắt đơn; mobile hiển thị lần lượt theo chiều dọc.

### 7.7 Tin tức và bài viết

- Trang danh sách có một bài nổi bật, phía dưới là grid/list cân bằng.
- Category navigation tối đa một hàng; mobile dùng horizontal scroll.
- Card ưu tiên ảnh, category, tiêu đề, mô tả ngắn, ngày đọc.
- Trang bài viết giới hạn độ rộng nội dung 720–760px; sidebar chỉ chứa mục lục hoặc bài liên quan.
- Typography bài viết nhẹ hơn, giảm card hóa list/blockquote không cần thiết.

### 7.8 Search

- Một ô tìm kiếm toàn cục, nhóm kết quả theo Giá, Tin tức, Giao thương và Sản phẩm.
- Tab hoặc section có số lượng kết quả.
- Search suggestions chỉ dựa trên nội dung thật; không dùng icon sparkle.
- Lịch sử tìm kiếm chỉ lưu phía client khi người dùng đồng ý.

### 7.9 About, Contact, Legal

- About kể câu chuyện, phạm vi dữ liệu và cam kết nguồn tin; dùng ảnh thật.
- Contact: thông tin liên hệ + form một cột, bản đồ là nội dung phụ.
- Privacy/Terms dùng article layout, mục lục và ngày cập nhật.

### 7.10 Authentication

- Auth shell hai vùng trên desktop: form và ảnh/câu chuyện thương hiệu; mobile chỉ form + logo.
- Form tối đa 440px, label luôn hiển thị, error đặt sát field.
- Social login chỉ hiển thị nếu được cấu hình thật.
- Admin login có nhận diện riêng bằng nhãn “Quản trị”, không cần màu hoặc icon cảnh báo quá mạnh.

### 7.11 Dashboard người dùng

- Tạo dashboard shell thống nhất với sidebar/drawer và page header.
- Tổng quan chỉ có 4 nhóm: giá đang theo dõi, cảnh báo gần nhất, tin đăng, đơn hàng.
- Saved/alerts dùng table hoặc list, có bulk action khi hợp lý.
- Orders dùng timeline trạng thái và thông tin thanh toán rõ.
- Settings chia tab Hồ sơ, Bảo mật, Thông báo; tránh một form quá dài.

### 7.12 Admin

- Khung responsive, sidebar nhóm nghiệp vụ, header có breadcrumb và user menu.
- Dashboard admin ưu tiên KPI có ngữ cảnh, pending tasks và hoạt động gần đây.
- Các trang quản trị dùng một `AdminDataTable` chung: search, filter, sort, pagination, selection, bulk actions.
- Create/edit dùng cùng `FormSection`, sticky action bar và cảnh báo unsaved changes.
- Destructive actions bắt buộc confirm dialog có tên đối tượng.
- Audit log dùng table mật độ cao và drawer xem JSON/details thay vì mở trang mới.

## 8. Component cần chuẩn hóa hoặc tạo mới

### Foundation

- `AppContainer`, `PageShell`, `PageHeader`, `SectionHeader`
- `Stack`, `Inline`, `ResponsiveGrid`
- `Text`, `Metric`, `PriceValue`, `ChangeValue`, `Timestamp`

### Navigation

- `PublicHeader`, `MobileNavigationDrawer`, `UserMenu`
- `DashboardSidebar`, `AdminSidebar`, `Breadcrumbs`
- `Footer`, `ContextTicker`

### Data and content

- `DataToolbar`, `FilterSheet`, `ActiveFilterChips`
- `DataTable`, `CompactDataList`, `Pagination`
- `MetricStrip`, `PriceSummary`, `StatusBadge`
- `ChartFrame`, `ChartLegend`, `LastUpdated`
- `ArticleCard`, `ProductCard`, `MarketPostCard`

### Feedback and forms

- `LoadingSkeleton`, `EmptyState`, `NoResults`, `ErrorState`, `OfflineState`
- `Field`, `FieldError`, `FormSection`, `FormActions`
- `ConfirmDialog`, `Toast`, `InlineAlert`

Mỗi component cần có các biến thể light/dark, mobile/desktop và state hover/focus/disabled/loading/error.

## 9. Responsive strategy

### Mobile 320–767px

- Một cột, touch target tối thiểu 44px.
- Action quan trọng luôn có label; icon-only chỉ cho hành động quen thuộc.
- Filter mở sheet; table chuyển compact list.
- Không dùng sidebar cố định hoặc modal rộng.
- Sticky CTA không che nội dung và tôn trọng safe-area.

### Tablet 768–1023px

- Grid 2 cột; navigation dùng drawer.
- Dashboard/admin sidebar có thể thu gọn hoặc chuyển overlay.
- Toolbar cho phép xuống hai hàng có kiểm soát.

### Desktop 1024px+

- Public content 1240px; data content tối đa 1360px.
- Dashboard/admin có sidebar cố định và main content co giãn.
- Table hiển thị đầy đủ, filter nâng cao ở popover/sidebar tùy trang.

## 10. Accessibility và content quality

- WCAG 2.2 AA cho contrast, keyboard, focus và target size.
- Không truyền tải tăng/giảm hoặc trạng thái chỉ bằng màu.
- Heading đúng thứ bậc; mỗi trang chỉ có một H1.
- Form có label, help text và error liên kết bằng ARIA.
- Dialog quản lý focus; Escape đóng được; trigger nhận lại focus.
- Số, tiền tệ, ngày giờ và đơn vị dùng format tiếng Việt thống nhất.
- Chuẩn hóa thuật ngữ: “Giá nông sản”, “Sàn giao thương”, “Vật tư”, “Cảnh báo giá”.
- Bỏ năm khỏi label thường trực; năm chỉ xuất hiện trong timestamp hoặc nội dung cần ngữ cảnh.

## 11. Kế hoạch triển khai

### Giai đoạn 0 — Audit và khóa phạm vi (2–3 ngày)

- Chụp baseline desktop/tablet/mobile cho toàn bộ route.
- Lập inventory component và xác định component trùng lặp.
- Chốt nội dung điều hướng, thuật ngữ và quyền hiển thị hành động.
- Đặt KPI trước redesign: task success, time-to-data, CLS, LCP, accessibility.

**Đầu ra:** route inventory, component inventory, screenshot baseline, danh sách regression flows.

### Giai đoạn 1 — Foundation (3–5 ngày)

- Thay token màu, typography, radius, shadow và spacing.
- Chuẩn hóa Button, Input, Select, Card, Badge, Table, Dialog, Tabs và Toast.
- Xây state components và utility cho số liệu.
- Viết trang playground/internal showcase cho component.

**Điều kiện qua:** component đạt keyboard/focus, light/dark và không phá route hiện tại.

### Giai đoạn 2 — Global shell (3–4 ngày)

- Thiết kế lại header, mobile drawer, footer, breadcrumb và page header.
- Rút gọn navigation và đưa ticker về đúng ngữ cảnh.
- Chuẩn hóa container và section spacing.

**Điều kiện qua:** không overflow ở 320px; desktop header không wrap; mọi route giữ điều hướng được.

### Giai đoạn 3 — Data core (5–7 ngày)

- Redesign Giá nông sản, Cà phê, chi tiết mặt hàng và Search.
- Tạo DataToolbar, table/list responsive, price/change components và chart frame.
- Chuẩn hóa loading/error/empty/no-results.

**Điều kiện qua:** so sánh giá nhanh trên desktop; thao tác filter/sort bằng một tay trên mobile; CSV và sync không đổi hành vi.

### Giai đoạn 4 — Weather và content (4–6 ngày)

- Redesign Weather, News list, Article detail, About và Contact.
- Chuẩn hóa content card và article typography.

**Điều kiện qua:** geolocation fail có fallback; article đạt readability; cảnh báo thời tiết không phụ thuộc màu.

### Giai đoạn 5 — Commerce (5–7 ngày)

- Redesign Marketplace list/detail/create post.
- Redesign Shop list/detail/cart/checkout.
- Chuẩn hóa cards, filters, trust cues và checkout summary.

**Điều kiện qua:** luồng đăng tin, thêm giỏ và checkout chạy hoàn chỉnh trên mobile/desktop.

### Giai đoạn 6 — User dashboard và auth (4–6 ngày)

- Tạo dashboard shell.
- Redesign overview, alerts, saved, my posts, orders và settings.
- Redesign login/register/reset/verify.

**Điều kiện qua:** role guard giữ nguyên; user luôn biết đang ở đâu và hành động tiếp theo là gì.

### Giai đoạn 7 — Admin (6–9 ngày)

- Tạo admin shell responsive và AdminDataTable.
- Chuyển lần lượt dashboard, users, prices, coffee, market, products, orders, news, contacts, audit logs và settings.
- Chuẩn hóa create/edit forms.

**Điều kiện qua:** mọi CRUD cũ hoạt động; bulk/destructive actions an toàn; admin dùng được ở tablet.

### Giai đoạn 8 — Polish và release (3–5 ngày)

- Visual regression ở 320, 375, 768, 1024, 1280 và 1440px.
- Keyboard/screen reader/contrast audit.
- Kiểm tra loading chậm, API error, empty data, text dài và ảnh lỗi.
- Đo Lighthouse/Core Web Vitals và giảm motion/bundle không cần thiết.
- Release theo feature flag hoặc từng nhóm route.

## 12. Thứ tự ưu tiên

### P0 — Phải làm trước

- Token và primitive components.
- Public header/mobile nav/footer.
- Page header, toolbar, states.
- Giá nông sản và trang chi tiết.
- Dashboard/admin responsive shell.

### P1 — Giá trị cao

- Trang chủ, thời tiết, marketplace, shop và checkout.
- User dashboard, auth, news/article.
- Admin data table và form patterns.

### P2 — Hoàn thiện

- About/contact/legal/search nâng cao.
- Dark mode polish.
- Animation tinh chỉnh và visual regression automation.

## 13. Tiêu chí nghiệm thu toàn dự án

- Không còn Sparkles hoặc icon gợi AI trong điều hướng, CTA và empty state.
- Không có horizontal overflow từ 320px trở lên.
- Mọi action dùng được bằng bàn phím và có focus visible.
- Public header tối đa 5 nhóm điều hướng chính.
- Cùng một loại trang dùng cùng page header, toolbar, state và spacing.
- Bảng giá desktop quét và so sánh được mà không mở từng card.
- Dashboard và admin có shell responsive riêng nhưng cùng design language.
- Không có card lồng card quá hai cấp.
- Không dùng gradient trang trí cho button/card.
- Loading/error/empty/no-results có mẫu thống nhất.
- Contrast đạt WCAG AA; trạng thái không chỉ biểu diễn bằng màu.
- LCP mục tiêu dưới 2.5 giây, CLS dưới 0.1 trên các route public trọng yếu.
- Các luồng đăng nhập, xem giá, lọc, tải CSV, đăng tin, thêm giỏ, checkout và CRUD admin không regression.

## 14. Phạm vi file dự kiến

Nhóm cần thay đổi trước:

- `frontend/src/styles/globals.css`
- `frontend/src/app/layout.tsx`
- `frontend/src/components/layout/*`
- `frontend/src/components/ui/*`
- `frontend/src/features/landing/sections/*`

Nhóm route public:

- `frontend/src/app/page.tsx`
- `frontend/src/app/commodities/*`
- `frontend/src/app/coffee/*`
- `frontend/src/app/weather/*`
- `frontend/src/app/marketplace/*`
- `frontend/src/app/shop/*`
- `frontend/src/app/checkout/*`
- `frontend/src/app/news/*`
- `frontend/src/app/search/*`

Nhóm authenticated/admin:

- `frontend/src/app/dashboard/*`
- `frontend/src/app/(auth)/*`
- `frontend/src/app/(admin)/*`
- `frontend/src/features/admin/components/*`

## 15. Quy tắc giữ phạm vi khi triển khai

- Không redesign đồng thời với thay đổi API hoặc database nếu không bắt buộc.
- Mỗi pull request chỉ nên xử lý một foundation hoặc một nhóm route có liên quan.
- Không sao chép component cũ rồi đổi tên; phải gom về pattern chung.
- Không thêm thư viện UI mới nếu primitive hiện tại có thể mở rộng.
- Không thêm icon để “lấp chỗ trống”; ưu tiên typography, spacing và đường phân cách.
- Mọi thay đổi lớn phải được kiểm tra bằng dữ liệu thật, dữ liệu rỗng, lỗi API và nội dung dài.

