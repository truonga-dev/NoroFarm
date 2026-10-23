"use client"

import { motion } from "framer-motion"
import { CircleCheck } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"

const REASONS = [
  "Dữ liệu minh bạch, được tổng hợp từ các nguồn uy tín.",
  "Tốc độ siêu nhanh, không có thời gian chờ.",
  "Đầy đủ thông tin cho nhà nông: Giá, thời tiết, kỹ thuật.",
  "Giao diện trực quan, dễ sử dụng cho mọi lứa tuổi.",
  "Cộng đồng lớn mạnh, chia sẻ kinh nghiệm nhanh chóng.",
  "Miễn phí cho nhà nông.",
]

export function WhyChooseUs() {
  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 relative"
          >
            <div className="aspect-square rounded-full bg-primary/5 absolute -inset-8 -z-10 blur-3xl" />
            <div className="aspect-[4/3] rounded-3xl bg-card border shadow-2xl overflow-hidden flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595856417531-15b5b9c08c4e?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-50 dark:opacity-30 mix-blend-overlay" />
              <div className="relative z-10 w-3/4 bg-background/80 backdrop-blur-xl p-8 rounded-2xl border shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CircleCheck className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <div className="font-bold">Độ chính xác</div>
                    <div className="text-sm text-muted-foreground">99.9% dữ liệu chuẩn</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "99%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-emerald-500" 
                    />
                  </div>
                  <div className="h-2 w-3/4 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "85%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.7 }}
                      className="h-full bg-emerald-400" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Tại sao nên chọn NoroFarm?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Chúng tôi hiểu nỗi vất vả của người nông dân. Do đó, NoroFarm ra đời với sứ mệnh mang sức mạnh công nghệ áp dụng vào nông nghiệp, giúp quyết định canh tác và mua bán trở nên dễ dàng và chính xác hơn bao giờ hết.
            </p>
            
            <ul className="space-y-4">
              {REASONS.map((text, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CircleCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <span className="text-lg font-medium">{text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  )
}
