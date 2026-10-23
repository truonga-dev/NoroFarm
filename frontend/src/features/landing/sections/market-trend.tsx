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
            <Link href="/market">Xem tất cả</Link>
          </Button>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center text-muted-foreground h-40 flex items-center justify-center bg-card rounded-2xl border">
            Chưa có tin đăng nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {posts.slice(0, 4).map((post: any, idx: number) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border bg-card shadow-sm transition-all hover:shadow-lg flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-muted w-full overflow-hidden">
                  {post.images && post.images.length > 0 ? (
                    <Image src={post.images[0].image_url} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/50 group-hover:scale-105 transition-transform duration-500">
                      <ShoppingCart className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold text-white shadow-sm ${post.post_type === 'SELL' ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                      {post.post_type === 'SELL' ? 'CHÀO BÁN' : 'CẦN MUA'}
                    </span>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  
                  <div className="mt-auto pt-4 border-t border-border/50">
                    <p className="text-xl font-bold text-primary">
                      {post.price ? `${post.price.toLocaleString("vi-VN")} đ` : "Thỏa thuận"}
                      {post.price && <span className="text-sm font-normal text-muted-foreground ml-1">/ {post.unit || "kg"}</span>}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span>SL: {post.quantity} {post.unit || "kg"}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(post.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</span>
                    </div>
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
