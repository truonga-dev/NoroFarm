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
        <div className="rounded-3xl bg-gradient-to-br from-amber-50/80 via-white to-emerald-50/70 dark:from-emerald-950/30 dark:via-card dark:to-amber-950/10 border border-amber-200/80 dark:border-border p-8 md:p-14 relative overflow-hidden shadow-sm">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <ShoppingBag className="h-64 w-64 text-primary" />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-900 mb-3">
                Thương mại Nông sản & Vật tư Chính hãng
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-5 text-foreground">
                Sàn Giao dịch B2B & Cửa hàng Vật tư Nông nghiệp
              </h2>
              <p className="text-base text-muted-foreground mb-7 leading-relaxed">
                Kết nối trực tiếp nông hộ, hợp tác xã với đại lý thu mua nông sản và nhà phân phối phân bón, giống cây trồng chính hãng kèm thanh toán VietQR tự động.
              </p>
              
              <ul className="space-y-3.5 mb-8">
                {[
                  { icon: Store, text: "Đăng tin thu mua & chào bán đối chiếu giá thị trường 2026" },
                  { icon: ShieldCheck, text: "Vật tư phân bón, chế phẩm sinh học chính hãng, rõ nguồn gốc" },
                  { icon: Truck, text: "Đặt hàng trực tuyến, quét mã VietQR và giao tận vườn" },
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="rounded-xl bg-amber-100 border border-amber-200 p-2">
                      <item.icon className="h-4 w-4 text-amber-900" />
                    </div>
                    <span className="font-semibold text-sm text-foreground">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
              
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="rounded-xl px-7 h-12 font-bold shadow-md shadow-primary/20" asChild>
                  <Link href="/marketplace">
                    Vào Sàn B2B <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-xl px-7 h-12 font-bold border-amber-300 bg-amber-50 text-amber-950 hover:bg-amber-100" asChild>
                  <Link href="/shop">
                    Cửa hàng Vật tư
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white dark:bg-card border border-emerald-200/80 p-5 shadow-md space-y-3">
                <span className="inline-block rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5">
                  CHÀO BÁN NÔNG SẢN
                </span>
                <h4 className="font-bold text-base text-foreground">Cà phê Nhân xô Robusta Đắk Lắk Chuẩn S18</h4>
                <p className="text-xl font-extrabold text-primary tabular-nums">129.500 đ/kg</p>
                <p className="text-xs text-muted-foreground">Sản lượng: 15 Tấn · Đã kiểm định độ ẩm 12.5%</p>
              </div>
              <div className="rounded-2xl bg-amber-50/90 dark:bg-card border border-amber-200/90 p-5 shadow-md space-y-3 sm:mt-6">
                <span className="inline-block rounded-full bg-amber-200/90 text-amber-950 text-[11px] font-extrabold px-2.5 py-0.5">
                  VẬT TƯ CHÍNH HÃNG
                </span>
                <h4 className="font-bold text-base text-foreground">Phân bón NPK Đầu Trâu Mùa khô Tây Nguyên</h4>
                <p className="text-xl font-extrabold text-amber-800 dark:text-amber-400 tabular-nums">850.000 đ/bao</p>
                <p className="text-xs text-muted-foreground">Hỗ trợ tính định mức tự động theo diện tích (ha)</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
