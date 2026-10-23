import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Search, Home, Map } from "lucide-react"

export default function NotFound() {
  return (
    <Section className="flex-1 flex items-center justify-center min-h-[70vh] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      <Container>
        <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
          <div className="relative mb-8">
            <h1 className="text-[150px] md:text-[200px] font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/20 leading-none select-none">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-md px-6 py-2 rounded-full border shadow-sm">
              <span className="font-semibold text-lg flex items-center gap-2">
                <Map className="w-5 h-5 text-primary" /> Lạc đường rồi
              </span>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold tracking-tight mb-4">Không tìm thấy trang</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên, hoặc tạm thời không thể truy cập.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Button size="lg" className="rounded-full w-full sm:w-auto gap-2" asChild>
              <Link href="/">
                <Home className="w-5 h-5" /> Về Trang chủ
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto gap-2" asChild>
              <Link href="/search">
                <Search className="w-5 h-5" /> Tìm kiếm
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
