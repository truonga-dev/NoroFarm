import Link from 'next/link'
import { ArrowRight, BookOpen, CloudSun, LineChart, Store } from 'lucide-react'

import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'

const QUICK_LINKS = [
  {
    title: 'Giá nông sản hôm nay',
    description: 'Theo dõi giá thu mua theo mặt hàng và khu vực.',
    href: '/commodities',
    icon: LineChart,
  },
  {
    title: 'Thời tiết nông vụ',
    description: 'Xem nhiệt độ, độ ẩm và khuyến nghị canh tác.',
    href: '/weather',
    icon: CloudSun,
  },
  {
    title: 'Sàn giao dịch B2B',
    description: 'Kết nối nhu cầu mua và bán từ thị trường.',
    href: '/marketplace',
    icon: Store,
  },
  {
    title: 'Tin tức và kỹ thuật',
    description: 'Đọc phân tích thị trường và hướng dẫn sản xuất.',
    href: '/news',
    icon: BookOpen,
  },
]

export function HeroSection() {
  return (
    <section className="border-border dark:bg-card/40 border-b bg-[#f6f4ec] py-12 md:py-16 lg:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-primary text-sm font-semibold tracking-[0.16em] uppercase">
              Cổng thông tin nông nghiệp Việt Nam
            </p>
            <h1 className="text-foreground mt-4 text-4xl leading-[1.08] font-bold tracking-[-0.04em] sm:text-5xl lg:text-[3.65rem]">
              Dữ liệu thiết thực cho từng quyết định mùa vụ
            </h1>
            <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-7 md:text-lg md:leading-8">
              NoroFarm tổng hợp giá nông sản, thời tiết, giao dịch và tin tức
              chuyên ngành trong một hệ thống dễ tra cứu dành cho nhà nông, hợp
              tác xã và thương lái.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild className="h-11 px-6">
                <Link href="/commodities">
                  Xem bảng giá hôm nay <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-background h-11 px-6"
              >
                <Link href="/marketplace">Khám phá thị trường B2B</Link>
              </Button>
            </div>
            <div className="border-border/80 text-muted-foreground mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t pt-5 text-sm">
              <span>Cập nhật theo khu vực</span>
              <span>Dữ liệu dễ đối chiếu</span>
              <span>Tối ưu cho máy tính và điện thoại</span>
            </div>
          </div>

          <div className="border-border bg-background overflow-hidden rounded-xl border shadow-sm">
            <div className="border-border border-b px-5 py-4">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.12em] uppercase">
                Truy cập nhanh
              </p>
              <h2 className="mt-1 text-lg font-semibold">
                Bạn cần thông tin gì?
              </h2>
            </div>
            <div className="divide-border divide-y">
              {QUICK_LINKS.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group hover:bg-muted/50 grid grid-cols-[40px_minmax(0,1fr)_20px] items-center gap-3 px-5 py-4 transition-colors"
                  >
                    <span className="border-border bg-card text-primary flex h-10 w-10 items-center justify-center rounded-lg border">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <strong className="group-hover:text-primary block text-sm font-semibold">
                        {item.title}
                      </strong>
                      <span className="text-muted-foreground mt-1 block text-xs leading-5">
                        {item.description}
                      </span>
                    </span>
                    <ArrowRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
