"use client"

import * as React from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Search, ShoppingCart, Filter, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/toast-context"
import { shopService } from "@/api/services/shop.service"
import { useCartStore } from "@/store/useCartStore"
import { PageTitle } from "@/components/layout/page-title"
import { getAssetUrl } from "@/api/client"

export default function ShopPage() {
  const [search, setSearch] = React.useState("")
  const [category, setCategory] = React.useState<number | undefined>(undefined)
  const [page, setPage] = React.useState(1)
  
  const toast = useToast()
  const addItem = useCartStore(state => state.addItem)
  const cartItemCount = useCartStore(state => state.getItemCount())

  const { data: categoriesData } = useQuery({
    queryKey: ["shop-categories"],
    queryFn: () => shopService.getCategories()
  })
  const categories = categoriesData?.data || []

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["shop-products", page, search, category],
    queryFn: () => shopService.getProducts({ page, size: 20, search: search || undefined, category_id: category })
  })
  const products = productsData?.data?.items || []

  const handleAddToCart = (product: any) => {
    if (product.stock <= 0) {
      toast.error("Sản phẩm đã hết hàng!")
      return
    }
    addItem(product, 1)
    toast.success(`Đã thêm ${product.name} vào giỏ hàng`)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageTitle title="Cửa Hàng Nông Sản" description="Mua sắm các sản phẩm chính hãng, chất lượng cao từ NoroFarm." className="pb-0" />
        <Button asChild className="bg-primary hover:bg-primary/90 shadow-md">
          <Link href="/checkout">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Giỏ hàng ({cartItemCount})
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-background p-4 rounded-xl border shadow-sm sticky top-16 z-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm sản phẩm..." 
            className="pl-9 bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:bg-background"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <Button 
            variant={category === undefined ? "default" : "outline"} 
            onClick={() => { setCategory(undefined); setPage(1); }}
            className="whitespace-nowrap"
          >
            Tất cả
          </Button>
          {categories.map((c: any) => (
            <Button 
              key={c.id}
              variant={category === c.id ? "default" : "outline"} 
              onClick={() => { setCategory(c.id); setPage(1); }}
              className="whitespace-nowrap"
            >
              {c.name}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-background rounded-xl border shadow-sm p-4 h-[300px] animate-pulse flex flex-col">
              <div className="w-full h-40 bg-muted rounded-lg mb-4"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-background rounded-xl border shadow-sm">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold">Không tìm thấy sản phẩm</h3>
          <p className="text-muted-foreground mt-1">Vui lòng thử từ khóa khác hoặc chọn danh mục khác.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div key={product.id} className="bg-background rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
              <Link href={`/shop/${product.id}`} className="block relative aspect-square overflow-hidden bg-muted">
                {product.image_url ? (
                  <img src={getAssetUrl(product.image_url)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">Hết hàng</span>
                  </div>
                )}
              </Link>
              <div className="p-4 flex flex-col flex-1">
                <div className="text-xs text-muted-foreground mb-1">{product.category?.name || "Chưa phân loại"}</div>
                <Link href={`/shop/${product.id}`} className="font-semibold hover:text-primary transition-colors line-clamp-2 flex-1">
                  {product.name}
                </Link>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="text-primary font-bold text-lg">{product.price.toLocaleString("vi-VN")} đ</div>
                    <div className="text-xs text-muted-foreground">/ {product.unit}</div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0}
                    className="shrink-0"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" /> Thêm
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
