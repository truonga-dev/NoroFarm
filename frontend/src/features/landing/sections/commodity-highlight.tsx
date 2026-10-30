"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Coffee, Apple, TreePine, Leaf, ArrowRight } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CommodityHighlight({ initialData = [] }: { initialData?: any[] }) {
  const itemsToDisplay = initialData.length > 0 ? initialData.slice(0, 4).map((item: any) => {
    const isUp = (item.price_change ?? item.change_24h ?? 0) >= 0;
    const priceChange = item.price_change ?? item.change_24h ?? 0;
    const changeText = item.price_change_percent != null 
      ? `${isUp ? "+" : ""}${Number(item.price_change_percent).toFixed(2)}%`
      : priceChange !== 0 ? `${isUp ? "+" : ""}${priceChange.toLocaleString("vi-VN")} đ` : "N/A";
      
    // Determine color based on category/name
    let icon = Leaf;
    let color = "text-emerald-600";
    let bg = "bg-emerald-600/10";
    
    if (item.name?.toLowerCase().includes("cà phê") || item.name?.toLowerCase().includes("robusta") || item.name?.toLowerCase().includes("arabica")) {
      icon = Coffee;
      color = "text-amber-600";
      bg = "bg-amber-600/10";
    }

    return {
      id: item.id,
      name: item.name,
      price: item.current_price != null ? item.current_price.toLocaleString("vi-VN") : "--",
      change: changeText,
      isUp,
      icon,
      color,
      bg,
      unit: item.unit || "VND / kg"
    };
  }) : [];

  return (
    <Section>
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-900 mb-2.5">
              Bảng giá Nông sản Chủ lực 2026
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Thị trường Nông sản Hôm nay</h2>
            <p className="text-muted-foreground mt-1.5">Cập nhật giá thu mua tại vườn và sàn giao dịch theo thời gian thực.</p>
          </div>
          <Button variant="outline" className="hidden md:flex border-emerald-200 bg-emerald-50/60 text-primary hover:bg-emerald-100/70 font-semibold" asChild>
            <Link href="/commodities">Xem bảng giá đầy đủ <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        
        {itemsToDisplay.length === 0 ? (
          <div className="text-center text-muted-foreground h-24 flex items-center justify-center bg-card rounded-2xl border">
            Đang cập nhật giá nông sản...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {itemsToDisplay.map((item: any, idx: number) => (
              <Link key={item.id} href={`/commodities/${item.id}`} className="block h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="group relative h-full overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className={cn("inline-flex rounded-xl p-2.5 ring-1 ring-inset ring-current/15", item.bg, item.color)}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums border",
                          item.isUp
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                            : "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400"
                        )}
                      >
                        {item.change}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <div className="mt-3 flex items-baseline gap-1.5">
                      <p className="text-2xl font-extrabold tracking-tight tabular-nums text-foreground">
                        {item.price}
                      </p>
                      <p className="text-xs font-semibold text-muted-foreground">đ/{item.unit || "kg"}</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                    <span>Biểu đồ & Dự báo 2026</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </Section>
  )
}
