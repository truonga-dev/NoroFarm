import { Metadata } from "next"
import { Container } from "@/components/layout/container"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Điều khoản dịch vụ | NoroFarm",
  description: "Điều khoản dịch vụ và quy định sử dụng nền tảng NoroFarm.",
}

export default function TermsPage() {
  return (
    <div className="py-16 md:py-24 bg-background">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Điều khoản dịch vụ</h1>
            <p className="text-muted-foreground">Cập nhật lần cuối: Tháng 7, 2026</p>
          </div>

          <div className="space-y-8 text-foreground/80 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">1. Giới thiệu</h2>
              <p>
                Chào mừng bạn đến với NoroFarm. Bằng việc truy cập và sử dụng trang web, ứng dụng di động, hoặc các dịch vụ liên quan của chúng tôi (gọi chung là &quot;Dịch vụ&quot;), bạn đồng ý tuân thủ các Điều khoản dịch vụ này.
              </p>
              <p>
                NoroFarm cung cấp nền tảng số hóa nông nghiệp, dữ liệu giá cả thị trường, thời tiết và các công cụ quản lý trang trại thông minh.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">2. Tài khoản và Bảo mật</h2>
              <p>
                Để sử dụng một số tính năng, bạn cần tạo tài khoản. Bạn có trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động diễn ra dưới tài khoản của mình.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cung cấp thông tin chính xác, đầy đủ khi đăng ký.</li>
                <li>Không chia sẻ tài khoản với người khác.</li>
                <li>Thông báo ngay cho chúng tôi nếu phát hiện truy cập trái phép.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">3. Quyền và Trách nhiệm</h2>
              <p>
                Người dùng được cấp quyền sử dụng Dịch vụ cho mục đích cá nhân hoặc nội bộ doanh nghiệp nông nghiệp của mình.
              </p>
              <p>Bạn không được phép:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Sao chép, phân phối hoặc khai thác dữ liệu từ NoroFarm cho mục đích thương mại mà không có sự đồng ý.</li>
                <li>Sử dụng các công cụ tự động (bot, scraper) để thu thập dữ liệu giá cả, thị trường từ hệ thống.</li>
                <li>Thực hiện các hành vi gây gián đoạn, quá tải hoặc làm tổn hại đến hạ tầng của NoroFarm.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">4. Tính chính xác của Dữ liệu</h2>
              <p>
                Mặc dù chúng tôi nỗ lực cung cấp dữ liệu giá cả, thời tiết và xu hướng thị trường chính xác nhất theo thời gian thực, NoroFarm không đảm bảo tính chính xác tuyệt đối. Các quyết định kinh doanh, mua bán nông sản dựa trên dữ liệu này là rủi ro của riêng bạn.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">5. Chấm dứt sử dụng</h2>
              <p>
                Chúng tôi có quyền đình chỉ hoặc chấm dứt tài khoản của bạn ngay lập tức, mà không cần thông báo trước, nếu bạn vi phạm bất kỳ quy định nào trong Điều khoản này.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Nếu bạn có câu hỏi, vui lòng <Link href="/contact" className="text-primary hover:underline">liên hệ với chúng tôi</Link>.
            </p>
            <Link href="/privacy" className="text-sm font-medium text-primary hover:underline">
              Đọc Chính sách bảo mật &rarr;
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
