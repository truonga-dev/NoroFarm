"use client"

import { motion } from "framer-motion"
import { Zap, Moon, Smartphone, Globe, Search, Layers } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"

const FEATURES = [
  {
    icon: Zap,
    title: "Realtime Performance",
    desc: "Cập nhật giá cả nhanh chóng theo thời gian thực với độ trễ tính bằng mili-giây.",
  },
  {
    icon: Moon,
    title: "Dark Mode Support",
    desc: "Giao diện chuyển đổi linh hoạt giúp bảo vệ mắt khi sử dụng vào ban đêm.",
  },
  {
    icon: Smartphone,
    title: "Mobile First Design",
    desc: "Trải nghiệm hoàn hảo trên mọi thiết bị, từ điện thoại, máy tính bảng đến desktop.",
  },
  {
    icon: Globe,
    title: "SEO Tối ưu",
    desc: "Cấu trúc thông tin được tối ưu hóa để thân thiện với các công cụ tìm kiếm.",
  },
  {
    icon: Search,
    title: "Tìm kiếm thông minh",
    desc: "Tra cứu dữ liệu nông sản, tin tức nhanh chóng với công cụ tìm kiếm tức thì.",
  },
  {
    icon: Layers,
    title: "Hệ sinh thái toàn diện",
    desc: "Tích hợp giá cả, thời tiết, tin tức và sàn giao dịch trong một nền tảng duy nhất.",
  },
]

export function FeaturesSection() {
  return (
    <Section className="bg-muted/30 border-y">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Trải nghiệm Hiện đại</h2>
          <p className="text-muted-foreground">Nền tảng được xây dựng với những công nghệ tiên tiến nhất, mang lại trải nghiệm nhanh, mượt mà và trực quan.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <feat.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
