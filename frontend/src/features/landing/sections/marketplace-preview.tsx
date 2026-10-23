"use client"

import { motion } from "framer-motion"
import { ShoppingBag, Store, ShieldCheck, Truck, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Button } from "@/components/ui/button"

export function MarketplacePreview() {
  return (
    <Section>
      <Container>
        <div className="rounded-[3rem] bg-gradient-to-br from-primary/10 via-background to-primary/5 border p-8 md:p-16 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <ShoppingBag className="h-64 w-64 text-primary" />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Sàn giao dịch vật tư Nông nghiệp
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                NoroFarm Marketplace kết nối trực tiếp nhà nông với các đại lý, nhà phân phối uy tín. Mua sắm vật tư, phân bón, giống cây trồng với giá cả minh bạch và chất lượng được đảm bảo.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  { icon: Store, text: "Hàng ngàn sản phẩm từ các thương hiệu lớn" },
                  { icon: ShieldCheck, text: "Chất lượng đảm bảo, nguồn gốc rõ ràng" },
                  { icon: Truck, text: "Giao hàng tận nơi đến tận vườn" },
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="rounded-full bg-primary/20 p-1">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
              
              <Button size="lg" className="rounded-full px-8 h-12 shadow-lg shadow-primary/25" asChild>
                <Link href="/marketplace">
                  Kết nối Marketplace <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="relative h-full min-h-[400px] hidden lg:block">
              {/* Mockup UI of marketplace */}
              <motion.div 
                initial={{ opacity: 0, y: 30, rotate: 2 }}
                whileInView={{ opacity: 1, y: 0, rotate: -2 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring" }}
                className="absolute right-0 top-10 w-[80%] rounded-2xl bg-card border shadow-2xl p-4"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-muted/80 rounded" />
                    <div className="h-4 w-1/2 bg-muted/50 rounded" />
                    <div className="h-6 w-1/3 bg-primary/20 rounded mt-4" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 50, rotate: -2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 2 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
                className="absolute left-0 bottom-10 w-[80%] rounded-2xl bg-card border shadow-2xl p-4 z-10"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-xl bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 bg-muted/80 rounded" />
                    <div className="h-4 w-1/3 bg-muted/50 rounded" />
                    <div className="h-6 w-1/4 bg-primary/20 rounded mt-4" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
