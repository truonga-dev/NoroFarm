"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, RefreshCw, Package, Plus, Minus, Star } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast-context"
import { shopService } from "@/api/services/shop.service"
import { useCartStore } from "@/store/useCartStore"
import { getAssetUrl } from "@/api/client"
import { Container } from "@/components/layout/container"
import { motion } from "framer-motion"

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const toast = useToast()
  const addItem = useCartStore(state => state.addItem)
  const [quantity, setQuantity] = React.useState(1)

  const productId = parseInt(id)

  const { data: productData, isLoading, error } = useQuery({
    queryKey: ["shop-product", productId],
    queryFn: () => shopService.getProductById(productId),
    enabled: !isNaN(productId)
  })

  const product = productData?.data || null

  const handleAddToCart = () => {
    if (!product) return
    if (product.stock <= 0) {
      toast.error("Sản phẩm đã hết hàng!")
      return
    }
    if (quantity > product.stock) {
      toast.error(`Số lượng đặt hàng vượt quá hàng tồn kho (${product.stock})`)
      return
    }
    addItem(product, quantity)
    toast.success(`Đã thêm ${quantity} x ${product.name} vào giỏ hàng`)
  }

  const handleBuyNow = () => {
    if (!product) return
    if (product.stock <= 0) {
      toast.error("Sản phẩm đã hết hàng!")
      return
    }
    if (quantity > product.stock) {
      toast.error(`Số lượng đặt hàng vượt quá hàng tồn kho (${product.stock})`)
      return
    }
    addItem(product, quantity)
    router.push("/checkout")
  }

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="space-y-6">
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-6 w-32 bg-muted rounded animate-pulse" />
              <div className="h-20 w-full bg-muted rounded animate-pulse" />
              <div className="h-10 w-40 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </Container>
    )
  }

  if (error || !product) {
    return (
      <Container className="py-20 text-center">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h2 className="text-2xl font-bold">Không tìm thấy sản phẩm</h2>
        <p className="text-muted-foreground mt-2">Sản phẩm có thể đã bị xóa hoặc không tồn tại.</p>
        <Button asChild className="mt-6 bg-primary hover:bg-primary/90">
          <Link href="/shop">
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại Cửa hàng
          </Link>
        </Button>
      </Container>
    )
  }

  return (
    <Container className="py-8">
      {/* Back link */}
      <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Quay lại Cửa hàng
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Card */}
        <div className="lg:col-span-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-square rounded-3xl border bg-card overflow-hidden shadow-sm flex items-center justify-center group"
          >
            {product.image_url ? (
              <img 
                src={getAssetUrl(product.image_url)} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            ) : (
              <Package className="w-24 h-24 text-muted-foreground/20" />
            )}
            {product.stock <= 0 && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm">
                <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-base shadow-md">Hết hàng</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category Tag */}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider">
              {product.category?.name || "Chưa phân loại"}
            </span>

            {/* Product Name */}
            <h1 className="text-3xl font-extrabold text-foreground leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Rating Indicator */}
            <div className="flex items-center gap-1.5 text-yellow-500">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground font-medium">(5.0 • 12 Đánh giá)</span>
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-3xl font-black text-primary">
                {product.price.toLocaleString("vi-VN")} đ
              </span>
              <span className="text-sm text-muted-foreground">/ {product.unit}</span>
            </div>

            {/* Divider */}
            <div className="border-t my-4" />

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Mô tả sản phẩm</h3>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {product.description || "Chưa có thông tin mô tả chi tiết cho sản phẩm này."}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Stock status and Quantity selection */}
            {product.stock > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Số lượng mua</span>
                  <span className="text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full text-xs">
                    Còn lại: {product.stock} {product.unit}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-xl bg-muted/20">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                      className="rounded-l-xl h-10 w-10 hover:bg-muted"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-12 text-center font-bold text-sm">{quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                      disabled={quantity >= product.stock}
                      className="rounded-r-xl h-10 w-10 hover:bg-muted"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                variant="outline"
                className="flex-1 h-12 border-primary text-primary hover:bg-primary/5 hover:text-primary font-bold rounded-2xl transition-all"
              >
                <ShoppingCart className="w-5 h-5 mr-2" /> Thêm vào giỏ
              </Button>
              <Button 
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-md transition-all"
              >
                Mua ngay
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 border-t pt-4 text-[10px] sm:text-xs text-muted-foreground text-center">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="font-semibold">Nông sản sạch 100%</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-5 h-5 text-primary" />
                <span className="font-semibold">Giao hàng hỏa tốc</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw className="w-5 h-5 text-primary" />
                <span className="font-semibold">Đổi trả 24h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
