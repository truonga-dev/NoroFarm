import { Metadata } from "next"
import { Container } from "@/components/layout/container"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Chính sách bảo mật | NoroFarm",
  description: "Chính sách bảo mật và cách chúng tôi xử lý dữ liệu của bạn.",
}

export default function PrivacyPage() {
  return (
    <div className="py-16 md:py-24 bg-background">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Chính sách bảo mật</h1>
            <p className="text-muted-foreground">Cập nhật lần cuối: Tháng 7, 2026</p>
          </div>

          <div className="space-y-8 text-foreground/80 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">1. Thu thập thông tin</h2>
              <p>
                Chúng tôi thu thập thông tin để cung cấp dịch vụ tốt hơn cho tất cả người dùng, từ việc tùy chỉnh bản tin thị trường đến tối ưu hóa quy trình quản lý trang trại của bạn.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Thông tin bạn cung cấp:</strong> Họ tên, email, số điện thoại, vị trí trang trại, loại nông sản canh tác khi bạn đăng ký tài khoản.</li>
                <li><strong>Dữ liệu tự động:</strong> Thông tin thiết bị, địa chỉ IP, cookie và lịch sử truy cập để cải thiện trải nghiệm người dùng.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">2. Sử dụng thông tin</h2>
              <p>
                Dữ liệu thu thập được sử dụng cho các mục đích:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cung cấp, duy trì và cải thiện nền tảng NoroFarm.</li>
                <li>Cá nhân hóa các đề xuất giá cả, cảnh báo thời tiết dựa trên vị trí của bạn.</li>
                <li>Phát triển các tính năng mới phục vụ nông nghiệp thông minh.</li>
                <li>Gửi thông báo về bảo mật, cập nhật hệ thống hoặc tin nhắn hỗ trợ.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">3. Chia sẻ thông tin</h2>
              <p>
                Chúng tôi cam kết không bán dữ liệu cá nhân của bạn cho bên thứ ba. Thông tin chỉ được chia sẻ trong các trường hợp:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Với sự đồng ý rõ ràng từ bạn.</li>
                <li>Cho các đối tác dịch vụ (ví dụ: nhà cung cấp dịch vụ lưu trữ đám mây, dịch vụ gửi email) tuân thủ nghiêm ngặt các tiêu chuẩn bảo mật.</li>
                <li>Khi có yêu cầu hợp pháp từ cơ quan có thẩm quyền theo quy định của pháp luật Việt Nam.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">4. Bảo mật dữ liệu</h2>
              <p>
                NoroFarm áp dụng các biện pháp mã hóa tiên tiến (SSL/TLS) để bảo vệ dữ liệu của bạn trên đường truyền và tại hệ thống lưu trữ. Mật khẩu được băm (hash) an toàn và không ai có thể đọc được, kể cả quản trị viên hệ thống.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">5. Quyền của bạn</h2>
              <p>
                Bạn có toàn quyền truy cập, chỉnh sửa hoặc yêu cầu xóa bỏ thông tin cá nhân và dữ liệu trang trại của mình khỏi hệ thống NoroFarm bất kỳ lúc nào thông qua phần Cài đặt tài khoản.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Nếu bạn có câu hỏi, vui lòng <Link href="/contact" className="text-primary hover:underline">liên hệ với chúng tôi</Link>.
            </p>
            <Link href="/terms" className="text-sm font-medium text-primary hover:underline">
              Đọc Điều khoản dịch vụ &rarr;
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
