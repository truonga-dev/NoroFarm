"use client"

import { motion } from "framer-motion"
import { ArrowRight, CloudDownload } from "lucide-react"
import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <Section className="py-24">
      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[3rem] bg-foreground text-background px-6 py-20 text-center"
        >
          {/* Abstract blobs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary blur-[100px]" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-blue-500 blur-[100px]" />
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Sẵn sàng tối ưu hóa <br /> năng suất của bạn?
            </h2>
            <p className="text-xl text-background/80 mb-10">
              Tham gia cộng đồng hàng vạn nông dân đang sử dụng NoroFarm mỗi ngày để cập nhật thông tin và cải thiện lợi nhuận.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="rounded-full h-14 px-8 text-lg w-full sm:w-auto" asChild>
                <Link href="/dashboard">
                  Đăng ký miễn phí <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg w-full sm:w-auto bg-transparent border-background/20 text-background hover:bg-background/10 hover:text-background" asChild>
                <Link href="#">
                  <CloudDownload className="mr-2 h-5 w-5" /> Tải Ứng dụng
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
