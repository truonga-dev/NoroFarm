"use client"

import { motion } from "framer-motion"
import { Coffee, Apple, TreePine, Leaf } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
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
        <div className="flex flex-col md:flex-row items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Thị trường Nông sản</h2>
            <p className="text-muted-foreground mt-2">Cập nhật giá cả các mặt hàng chủ lực thời gian thực.</p>
          </div>
        </div>
        
        {itemsToDisplay.length === 0 ? (
          <div className="text-center text-muted-foreground h-24 flex items-center justify-center bg-card rounded-2xl border">
            Đang cập nhật giá nông sản...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {itemsToDisplay.map((item: any, idx: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm transition-all hover:shadow-lg cursor-pointer"
              >
                <div className={cn("inline-flex rounded-2xl p-3 mb-4", item.bg)}>
                  <item.icon className={cn("h-6 w-6", item.color)} />
                </div>
                <h3 className="font-semibold text-lg line-clamp-1">{item.name}</h3>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold">{item.price}</p>
                    <p className="text-sm text-muted-foreground">{item.unit || "VND / kg"}</p>
                  </div>
                  <div className={cn("rounded-full px-2 py-1 text-xs font-medium", item.isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")}>
                    {item.change}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  )
}
