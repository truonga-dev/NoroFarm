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
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 text-white px-6 py-16 md:py-20 text-center border border-emerald-700/50 shadow-2xl"
        >
          {/* Soft Harvest Gold & Emerald glows */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-35 pointer-events-none">
            <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-300 blur-[110px]" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-400 blur-[110px]" />
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-950 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider mb-5">
              Đồng hành cùng Nông nghiệp Việt 2026
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5 text-white">
              Sẵn sàng tối ưu hóa năng suất & lợi nhuận mùa vụ?
            </h2>
            <p className="text-base md:text-lg text-emerald-100/90 mb-9 max-w-2xl mx-auto leading-relaxed">
              Tham gia cộng đồng hàng vạn nhà nông, hợp tác xã và thương lái đang sử dụng NoroFarm mỗi ngày để nắm bắt giá nông sản và cảnh báo thời tiết.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="rounded-xl h-13 px-8 text-base font-bold bg-amber-200 text-amber-950 hover:bg-amber-100 w-full sm:w-auto shadow-lg" asChild>
                <Link href="/dashboard">
                  Mở Bảng điều khiển <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl h-13 px-8 text-base font-bold w-full sm:w-auto bg-white/10 border-white/25 text-white hover:bg-white/20 hover:text-white" asChild>
                <Link href="/commodities">
                  <CloudDownload className="mr-2 h-5 w-5" /> Xem Bảng giá 2026
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  )
}
