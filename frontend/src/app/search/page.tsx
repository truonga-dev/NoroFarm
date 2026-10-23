import { PageTransition } from "@/components/layout/page-transition"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import { Search as SearchIcon, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Tìm kiếm",
}

export default function SearchPage() {
  return (
    <PageTransition>
      <Section className="min-h-[70vh]">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Tìm kiếm trên NoroFarm</h1>
            
            <div className="relative mb-12 shadow-sm rounded-full">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                className="pl-12 h-14 rounded-full text-lg bg-card"
                placeholder="Nhập tên nông sản, khu vực, tin tức..." 
                autoFocus
              />
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Từ khóa phổ biến</h3>
                <div className="flex flex-wrap gap-2">
                  {['Giá cà phê hôm nay', 'Dự báo El Nino', 'Sầu riêng Ri6', 'Hồ tiêu', 'Phân bón NPK'].map((tag) => (
                    <Link 
                      key={tag} 
                      href="#" 
                      className="px-4 py-2 rounded-full border bg-card hover:bg-muted text-sm transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="pt-8 border-t">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Gợi ý truy cập nhanh</h3>
                <div className="grid gap-3">
                  <Link href="/coffee" className="flex items-center justify-between p-4 rounded-xl hover:bg-muted transition-colors">
                    <span className="font-medium">Bảng giá Cà phê Tây Nguyên</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link href="/weather" className="flex items-center justify-between p-4 rounded-xl hover:bg-muted transition-colors">
                    <span className="font-medium">Thời tiết Đắk Lắk</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link href="/market" className="flex items-center justify-between p-4 rounded-xl hover:bg-muted transition-colors">
                    <span className="font-medium">Xu hướng giá Hồ tiêu 2026</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </PageTransition>
  )
}
