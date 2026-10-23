"use client";

import { useState } from "react";
import { PageTransition } from "@/components/layout/page-transition";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { PageTitle } from "@/components/layout/page-title";
import { commodityService } from "@/api/services/commodity.service";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, ArrowDownRight, Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton card cho loading state
function CommodityCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-card p-6">
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h-6 w-3/4 mb-4" />
      <div className="flex items-end justify-between">
        <div>
          <Skeleton className="h-8 w-28 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-5 w-14" />
      </div>
    </div>
  );
}

export default function CommoditiesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["commodities-all"],
    queryFn: () => commodityService.getCommodities({ size: 100 }),
  });

  const { data: catData } = useQuery({
    queryKey: ["commodity-categories"],
    queryFn: () => commodityService.getCategories(),
  });

  const allCommodities: any[] = data?.data?.items || [];
  const categories: any[] = catData?.data?.items || catData?.data || [];

  // Filter theo category và search
  const filtered = allCommodities.filter((item) => {
    const matchCategory =
      selectedCategory === "all" || String(item.category?.id) === selectedCategory;
    const matchSearch =
      !search ||
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.name?.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <PageTransition>
      <Section>
        <Container>
          <PageTitle
            title="Giá Nông Sản Tổng Hợp"
            description="Bảng giá các mặt hàng nông sản tiêu biểu: Hồ tiêu, sầu riêng, cao su, mắc ca..."
          />

          {/* Filter Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm nông sản..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory("all")}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  selectedCategory === "all"
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                )}
              >
                Tất cả
              </button>
              {categories.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(String(cat.id))}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    selectedCategory === String(cat.id)
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          {!isLoading && !isError && (
            <p className="mt-4 text-sm text-muted-foreground">
              Hiển thị <span className="font-medium text-foreground">{filtered.length}</span>{" "}
              mặt hàng
            </p>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <CommodityCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center text-red-400">
              Không thể tải danh sách nông sản. Vui lòng thử lại.
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-8 rounded-2xl border bg-muted/30 p-12 text-center">
              <SlidersHorizontal className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium">Không tìm thấy nông sản phù hợp</p>
              <p className="text-sm text-muted-foreground mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
              {filtered.map((item: any) => {
                // Tính price_change từ data thực, fallback 0
                const priceChange: number = item.price_change ?? item.change_24h ?? 0;
                const isUp = priceChange >= 0;
                const changePercent =
                  item.price_change_percent != null
                    ? `${isUp ? "+" : ""}${Number(item.price_change_percent).toFixed(2)}%`
                    : priceChange !== 0
                    ? `${isUp ? "+" : ""}${priceChange.toLocaleString("vi-VN")} đ`
                    : "N/A";

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border bg-card p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      {item.category?.name || "Nông sản"}
                    </div>
                    <h3 className="font-bold text-lg mb-4 line-clamp-1">{item.name}</h3>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold">
                          {item.current_price != null
                            ? item.current_price.toLocaleString("vi-VN")
                            : "N/A"}
                        </div>
                        <div className="text-xs text-muted-foreground">{item.unit || "VNĐ/kg"}</div>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-1 font-medium text-sm",
                          priceChange === 0
                            ? "text-muted-foreground"
                            : isUp
                            ? "text-emerald-500"
                            : "text-rose-500"
                        )}
                      >
                        {priceChange !== 0 ? (
                          isUp ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )
                        ) : null}
                        {changePercent}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </Section>
    </PageTransition>
  );
}
