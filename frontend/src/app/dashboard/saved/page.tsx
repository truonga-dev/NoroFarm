"use client"

import { PageTransition } from "@/components/layout/page-transition"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import { Sidebar } from "@/components/layout/sidebar"
import { PageTitle } from "@/components/layout/page-title"
import { Bookmark, Star, Trash2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { profileService } from "@/api/services/profile.service"
import { useToast } from "@/components/ui/toast-context"
import Link from "next/link"

export default function SavedItemsPage() {
  const queryClient = useQueryClient()
  const toast = useToast()

  const { data: watchlistData, isLoading } = useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const res = await profileService.getWatchlist()
      return res.data
    }
  })

  const removeMutation = useMutation({
    mutationFn: (id: number) => profileService.removeFromWatchlist(id),
    onSuccess: () => {
      toast.success("Đã xóa khỏi mục đã lưu")
      queryClient.invalidateQueries({ queryKey: ["watchlist"] })
    },
    onError: () => {
      toast.error("Có lỗi xảy ra khi xóa")
    }
  })

  const items: any[] = watchlistData?.data || watchlistData || []

  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-4rem)] bg-muted/20">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">
          <Section className="py-6 md:py-8 lg:py-10">
            <Container>
              <div className="flex flex-col gap-4 mb-8">
                <PageTitle
                  title="Mục đã lưu"
                  description="Quản lý danh sách các nông sản mà bạn đang theo dõi."
                  className="pt-0 pb-0"
                />
              </div>

              <div className="bg-card rounded-2xl border shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Bookmark className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold">Nông sản quan tâm ({items.length})</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-32 w-full rounded-xl" />
                    ))
                  ) : items.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                      <Star className="w-12 h-12 mb-4 text-muted-foreground/30" />
                      <p>Bạn chưa lưu nông sản nào.</p>
                      <Button variant="outline" className="mt-4" asChild>
                        <Link href="/market">Khám phá thị trường</Link>
                      </Button>
                    </div>
                  ) : (
                    items.map((item: any) => (
                      <div key={item.id} className="group border rounded-xl p-4 hover:shadow-md transition-all bg-background relative overflow-hidden flex flex-col justify-between h-32">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {item.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold truncate">{item.name}</h4>
                              <p className="text-xs text-muted-foreground">{item.code || "Nông sản"}</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                            onClick={() => removeMutation.mutate(item.id)}
                            disabled={removeMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Link href={`/commodities/${item.id}`} className="text-sm text-primary font-medium flex items-center hover:underline">
                            Xem chi tiết <ArrowRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Container>
          </Section>
        </main>
      </div>
    </PageTransition>
  )
}
