"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { AlertTriangle, RotateCcw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <Section className="flex-1 flex items-center justify-center min-h-[70vh] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-destructive/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      <Container>
        <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto">
          <div className="w-24 h-24 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-8">
            <AlertTriangle className="w-12 h-12" />
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            Đã xảy ra sự cố ngoài ý muốn
          </h1>
          
          <p className="text-lg text-muted-foreground mb-12">
            Hệ thống đang gặp trục trặc kỹ thuật hoặc không thể xử lý yêu cầu của bạn lúc này. Chúng tôi đã ghi nhận lỗi và đang khắc phục.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Button size="lg" onClick={() => reset()} className="rounded-full w-full sm:w-auto gap-2">
              <RotateCcw className="w-5 h-5" /> Thử lại
            </Button>
            <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto gap-2" asChild>
              <Link href="/">
                <Home className="w-5 h-5" /> Về Trang chủ
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
