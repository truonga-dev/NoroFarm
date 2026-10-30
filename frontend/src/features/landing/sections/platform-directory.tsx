import Link from 'next/link'
import {
  ArrowRight,
  Bell,
  Building2,
  Headphones,
  PackageSearch,
  ShoppingBasket,
  UserRound,
} from 'lucide-react'

import { Container } from '@/components/layout/container'

const SERVICES = [
  {
    title: 'Dành cho nhà nông',
    description: 'Theo dõi giá, thời tiết và lưu mặt hàng quan tâm.',
    href: '/dashboard',
    icon: UserRound,
  },
  {
    title: 'Dành cho hợp tác xã',
    description: 'Đăng nhu cầu mua bán và tiếp cận đối tác thị trường.',
    href: '/marketplace',
    icon: Building2,
  },
  {
    title: 'Cảnh báo biến động giá',
    description: 'Thiết lập ngưỡng để theo dõi mặt hàng quan trọng.',
    href: '/dashboard/alerts',
    icon: Bell,
  },
  {
    title: 'Tra cứu nông sản',
    description: 'Tìm mặt hàng, lịch sử giá và khu vực thu mua.',
    href: '/search',
    icon: PackageSearch,
  },
  {
    title: 'Cửa hàng vật tư',
    description: 'Xem phân bón, giống và thiết bị phục vụ sản xuất.',
    href: '/shop',
    icon: ShoppingBasket,
  },
  {
    title: 'Liên hệ hỗ trợ',
    description: 'Gửi yêu cầu và nhận hướng dẫn sử dụng nền tảng.',
    href: '/contact',
    icon: Headphones,
  },
]

export function PlatformDirectory() {
  return (
    <section className="border-border bg-muted/30 border-y py-12 md:py-16">
      <Container>
        <div className="grid gap-7 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-10">
          <div>
            <p className="text-primary text-sm font-semibold tracking-[0.12em] uppercase">
              Danh mục dịch vụ
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.025em]">
              Một điểm đến cho các nhu cầu nông nghiệp
            </h2>
            <p className="text-muted-foreground mt-4 text-sm leading-7">
              Chọn đúng khu vực để bắt đầu nhanh, từ tra cứu thông tin công khai
              đến công cụ dành riêng cho tài khoản.
            </p>
          </div>

          <div className="border-border bg-card grid overflow-hidden rounded-xl border sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => {
              const Icon = service.icon
              return (
                <Link
                  key={service.href}
                  href={service.href}
                  className="group border-border hover:bg-muted/50 border-b p-5 transition-colors last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-last-child(-n+3)]:border-b-0"
                >
                  <span className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="group-hover:text-primary mt-4 text-sm font-semibold">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mt-2 min-h-10 text-xs leading-5">
                    {service.description}
                  </p>
                  <span className="text-primary mt-4 inline-flex items-center text-xs font-semibold">
                    Mở dịch vụ <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}
