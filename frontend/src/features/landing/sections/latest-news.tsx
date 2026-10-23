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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.slice(0, 3).map((item: any, idx: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer flex flex-col gap-4"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                  {item.thumbnail_url ? (
                    <Image src={item.thumbnail_url} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-muted-foreground/20 to-muted-foreground/10 group-hover:scale-105 transition-transform duration-500" />
                  )}
                  {item.category && (
                    <div className="absolute top-4 left-4">
                      <span className={cn("px-3 py-1 rounded-full text-xs font-semibold text-white bg-primary shadow-md")}>
                        {item.category.name}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(item.published_at || item.created_at).toLocaleDateString('vi-VN')}
                  </div>
                  <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2">
                    {item.summary || (item.content ? item.content.replace(/<[^>]*>?/gm, '').substring(0, 120) + "..." : "")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  )
}

