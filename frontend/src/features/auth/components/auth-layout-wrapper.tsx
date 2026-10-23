import { ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { Sprout, TrendingUp, CloudSun, Bell } from "lucide-react"

const features = [
  {
    icon: TrendingUp,
    title: "Giá nông sản thời gian thực",
    desc: "Cập nhật tức thì từ hàng trăm sàn giao dịch trong nước",
  },
  {
    icon: CloudSun,
    title: "Dự báo thời tiết nông vụ",
    desc: "Thông tin khí tượng chuyên biệt cho từng vùng canh tác",
  },
  {
    icon: Bell,
    title: "Cảnh báo thị trường thông minh",
    desc: "Nhận thông báo khi giá biến động vượt ngưỡng",
  },
]

export function AuthLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div className="relative hidden lg:flex flex-col overflow-hidden bg-zinc-950">
        {/* Background farm photo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop")',
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-zinc-950/65" />
        {/* Green glow top */}
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-600/20 blur-[100px]" />
        {/* Green glow bottom */}
        <div className="absolute -bottom-40 -right-20 h-[400px] w-[400px] rounded-full bg-emerald-500/15 blur-[80px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm">
              <Sprout className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">NoroFarm</span>
          </Link>

          {/* Middle content */}
          <div className="flex-1 flex flex-col justify-center mt-12">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 mb-6">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-300">Nền tảng nông nghiệp số #1 Việt Nam</span>
              </div>
              <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                Quản lý nông trại
                <br />
                <span className="text-emerald-400">thông minh hơn.</span>
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed max-w-sm">
                Nền tảng số hoá toàn diện — từ giá nông sản, thời tiết đến quản lý mùa vụ, tất cả trong một nơi.
              </p>
            </div>

            {/* Feature list */}
            <div className="space-y-4">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                    <f.icon className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{f.title}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="border-t border-white/10 pt-6">
            <blockquote>
              <p className="text-sm text-zinc-300 leading-relaxed italic">
                &quot;NoroFarm đã giúp chúng tôi số hóa toàn bộ quy trình quản lý trang trại, theo dõi giá cả thị trường và thời tiết theo thời gian thực.&quot;
              </p>
              <footer className="mt-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
                  ĐL
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Hợp tác xã Nông nghiệp Đắk Lắk</p>
                  <p className="text-xs text-zinc-500">Thành viên từ 2024</p>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col items-center justify-center relative bg-background min-h-screen">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(16,185,129,0.08),transparent)] pointer-events-none" />

        <div className="relative w-full max-w-[400px] px-6 py-10">
          {children}
          <p className="mt-8 px-4 text-center text-xs text-muted-foreground leading-relaxed">
            Bằng việc tiếp tục, bạn đồng ý với{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary transition-colors">
              Điều khoản dịch vụ
            </Link>{" "}
            và{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary transition-colors">
              Chính sách bảo mật
            </Link>{" "}
            của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  )
}
