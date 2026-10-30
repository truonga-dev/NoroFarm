"use client"

import { motion } from "framer-motion"
import { Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function LatestNews({ initialData = [] }: { initialData?: any[] }) {
  const articles = initialData

  return (
    <Section className="bg-muted/30">
      <Container>
        <div className="flex flex-col md:flex-row items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tin tức & Phân tích</h2>
            <p className="text-muted-foreground mt-2">Bản tin chuyên sâu từ các chuyên gia đầu ngành.</p>
          </div>
          <Button variant="ghost" className="hidden md:flex mt-4 md:mt-0" asChild>
            <Link href="/news">Xem tất cả <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
        
        {articles.length === 0 ? (
          <div className="text-center text-muted-foreground h-40 flex items-center justify-center">
            Chưa có tin tức nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((item: any, idx: number) => (
              <Link key={item.id} href={`/news/${item.slug || item.id}`} className="block h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="group cursor-pointer flex flex-col h-full rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted border-b border-border/50">
                    {item.thumbnail_url ? (
                      <Image src={item.thumbnail_url} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-muted to-emerald-500/10 group-hover:scale-105 transition-transform duration-500" />
                    )}
                    {item.category && (
                      <div className="absolute top-3 left-3">
                        <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-primary/95 backdrop-blur-sm shadow-sm")}>
                          {item.category.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        {new Date(item.published_at || item.created_at).toLocaleDateString('vi-VN')}
                      </div>
                      <h3 className="text-lg font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.summary || (item.content ? item.content.replace(/<[^>]*>?/gm, '').substring(0, 120) + "..." : "")}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs font-bold text-primary">
                      <span>Đọc bài phân tích</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
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

