"use client"

import { motion } from "framer-motion"
import { TrendingUp, ShoppingCart, Calendar } from "lucide-react"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function MarketTrend({ initialData = [] }: { initialData?: any[] }) {
  const posts = initialData

  return (
    <Section>
      <Container>
        <div className="flex flex-col md:flex-row items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Giao dịch thị trường</h2>
            <p className="text-muted-foreground">Các tin đăng mua bán nông sản mới nhất trên hệ thống.</p>
          </div>
          <Button variant="ghost" className="hidden md:flex mt-4 md:mt-0" asChild>
            <Link href="/marketplace">Xem tất cả</Link>
          </Button>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center text-muted-foreground h-40 flex items-center justify-center bg-card rounded-2xl border">
            Chưa có tin đăng nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.slice(0, 4).map((post: any, idx: number) => (
              <Link key={post.id} href={`/marketplace/${post.id}`} className="block h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="group relative h-full overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/40 flex flex-col"
                >
                  <div className="relative aspect-[16/10] bg-muted w-full overflow-hidden border-b border-border/50">
                    {post.images && post.images.length > 0 ? (
                      <Image src={post.images[0].image_url} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-muted/60 to-emerald-500/10 group-hover:scale-105 transition-transform duration-500">
                        <ShoppingCart className="h-8 w-8 text-primary/40 mb-1" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {post.commodity?.name || "Giao dịch B2B"}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide text-white shadow-sm ${post.post_type === 'SELL' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                        {post.post_type === 'SELL' ? 'CHÀO BÁN' : 'CẦN MUA'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-base line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    
                    <div className="mt-auto pt-3.5 border-t border-border/60">
                      <p className="text-xl font-extrabold tabular-nums text-primary">
                        {post.price ? `${post.price.toLocaleString("vi-VN")} đ` : "Thỏa thuận"}
                        {post.price && <span className="text-xs font-medium text-muted-foreground ml-1">/ {post.unit || "kg"}</span>}
                      </p>
                      <div className="flex items-center justify-between mt-2.5 text-xs text-muted-foreground font-medium">
                        <span className="bg-muted px-2 py-0.5 rounded-md text-foreground/80">
                          SL: {post.quantity} {post.unit || "kg"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {new Date(post.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                        </span>
                      </div>
                    </div>
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
