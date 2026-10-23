"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Activity } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"

export function HeroSection() {
  return (
    <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(2,6,23,0))]" />
      
      <Container>
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm"
          >
            <Activity className="mr-2 h-4 w-4" />
            <span>Nền tảng Nông nghiệp Thông minh số 1 Việt Nam</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight"
          >
            Dữ liệu Nông nghiệp <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
              Minh bạch & Thời gian thực
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl"
          >
            NoroFarm cung cấp giải pháp toàn diện về dữ liệu giá cả, thời tiết, tin tức và xu hướng thị trường, giúp nhà nông tối ưu hóa lợi nhuận.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4"
          >
            <Button size="lg" className="rounded-full h-12 px-8 text-base shadow-lg shadow-primary/25" asChild>
              <Link href="/coffee">
                Xem giá nông sản <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-base bg-background/50 backdrop-blur-sm" asChild>
              <Link href="/about">
                Khám phá NoroFarm
              </Link>
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
