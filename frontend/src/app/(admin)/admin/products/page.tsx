"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Search, Edit, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast-context"
import { shopService } from "@/api/services/shop.service"
import { apiClient, getAssetUrl } from "@/api/client"
import { AdminDataPanel, AdminEmptyState, AdminPageHeader, AdminToolbar } from "@/features/admin/components/admin-page"

export default function AdminProductsPage() {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingProduct, setEditingProduct] = React.useState<any>(null)
  
  const [formData, setFormData] = React.useState({
    category_id: 1, // Default, wait we need to fetch categories
    name: "",
    description: "",
    price: "",
    stock: "",
    unit: "kg",
    image_url: "",
    is_active: true
  })

  const queryClient = useQueryClient()
  const toast = useToast()

  const { data: categoriesData } = useQuery({
    queryKey: ["shop-categories"],
    queryFn: () => shopService.getCategories()
  })
  const categories = React.useMemo(() => categoriesData?.data || [], [categoriesData?.data])

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["shop-products", page, search],
    queryFn: () => shopService.getProducts({ page, size: 20, search: search || undefined })
  })
  const products = productsData?.data?.items || []

  const createMutation = useMutation({
    mutationFn: (data: any) => shopService.adminCreateProduct(data),
    onSuccess: () => {
      toast.success("Thêm sản phẩm thành công")
      setIsDialogOpen(false)
      resetForm()
      queryClient.invalidateQueries({ queryKey: ["shop-products"] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || "Lỗi khi thêm sản phẩm")
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => shopService.adminUpdateProduct(id, data),
    onSuccess: () => {
      toast.success("Cập nhật sản phẩm thành công")
      setIsDialogOpen(false)
      resetForm()
      queryClient.invalidateQueries({ queryKey: ["shop-products"] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || "Lỗi khi cập nhật sản phẩm")
    }
  })

  const resetForm = () => {
    setEditingProduct(null)
    setFormData({
      category_id: categories.length > 0 ? categories[0].id : 1,
      name: "",
      description: "",
      price: "",
      stock: "",
      unit: "kg",
      image_url: "",
      is_active: true
    })
  }

  const [isUploading, setIsUploading] = React.useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const uploadData = new FormData()
    uploadData.append("file", file)

    setIsUploading(true)
    try {
      const res = await apiClient.post("/media/upload", uploadData)
      const uploadedUrl = res.data?.url
      if (uploadedUrl) {
        setFormData(prev => ({ ...prev, image_url: uploadedUrl }))
        toast.success("Tải ảnh lên thành công!")
      } else {
        toast.error("Không tìm thấy đường dẫn ảnh")
      }
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi tải ảnh lên")
    } finally {
      setIsUploading(false)
    }
  }

  const handleOpenEdit = (product: any) => {
    setEditingProduct(product)
    setFormData({
      category_id: product.category_id,
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      unit: product.unit,
      image_url: product.image_url || "",
      is_active: product.is_active
    })
    setIsDialogOpen(true)
  }

  React.useEffect(() => {
    if (categories.length > 0 && !editingProduct) {
      setFormData((prev) => ({ ...prev, category_id: categories[0].id }))
    }
  }, [categories, editingProduct])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...formData,
      category_id: Number(formData.category_id),
      image_url: formData.image_url ? formData.image_url : null,
      description: formData.description ? formData.description : null,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    }

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="Cửa hàng B2C" title="Kho sản phẩm" description="Quản lý danh mục, giá bán, tồn kho và trạng thái hiển thị sản phẩm." actions={
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm sản phẩm
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Tên sản phẩm</Label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="VD: Phân bón NPK 20-20-15" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Danh mục</Label>
                  <select 
                    required
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    value={formData.category_id}
                    onChange={e => setFormData({...formData, category_id: parseInt(e.target.value)})}
                  >
                    {categories.length === 0 && <option value={1}>-- Trống --</option>}
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <select 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                    value={formData.is_active ? "true" : "false"}
                    onChange={e => setFormData({...formData, is_active: e.target.value === "true"})}
                  >
                    <option value="true">Đang bán</option>
                    <option value="false">Ngừng bán</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Giá bán (VNĐ)</Label>
                  <Input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Tồn kho</Label>
                  <Input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Đơn vị</Label>
                  <Input required value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} placeholder="VD: bao, kg" />
                </div>
              </div>
              <div className="space-y-3">
                <Label>Hình ảnh sản phẩm</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground block">Tải từ thiết bị:</span>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="cursor-pointer text-xs"
                    />
                    {isUploading && (
                      <span className="text-xs text-primary animate-pulse font-medium">Đang tải ảnh lên...</span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground block">Hoặc nhập liên kết URL:</span>
                    <Input
                      value={formData.image_url}
                      onChange={e => setFormData({...formData, image_url: e.target.value})}
                      placeholder="https://... hoặc /uploads/..."
                      className="text-xs"
                    />
                  </div>
                </div>
                {formData.image_url && (
                  <div className="mt-2 flex items-center gap-3 bg-muted/40 p-2.5 rounded-xl border border-muted/80">
                    <div className="w-14 h-14 bg-background rounded-lg border overflow-hidden shrink-0 flex items-center justify-center">
                      <img src={getAssetUrl(formData.image_url)} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-foreground truncate">Xem trước ảnh</div>
                      <div className="text-[10px] text-muted-foreground truncate">{formData.image_url}</div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData({...formData, image_url: ""})}
                      className="text-red-500 hover:text-red-600 text-xs px-2 h-7"
                    >
                      Xóa ảnh
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Mô tả chi tiết</Label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Công dụng, cách sử dụng..."
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingProduct ? "Lưu thay đổi" : "Thêm sản phẩm"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      } />

      <AdminToolbar>
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm sản phẩm..." 
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <p className="text-sm text-muted-foreground sm:ml-auto">{products.length} sản phẩm</p>
      </AdminToolbar>

      <AdminDataPanel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Sản phẩm</th>
                <th className="px-6 py-4 whitespace-nowrap">Giá bán</th>
                <th className="px-6 py-4 whitespace-nowrap">Tồn kho</th>
                <th className="px-6 py-4 whitespace-nowrap">Trạng thái</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Đang tải...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={5}><AdminEmptyState title="Chưa có sản phẩm" description="Thêm sản phẩm đầu tiên để bắt đầu vận hành cửa hàng." /></td></tr>
              ) : (
                products.map((item: any) => (
                  <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center shrink-0">
                          {item.image_url ? <img src={getAssetUrl(item.image_url)} className="w-full h-full object-cover rounded-md" alt="" /> : <Package className="w-5 h-5 text-muted-foreground" />}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.category?.name || "Chưa phân loại"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-emerald-600">
                      {item.price.toLocaleString("vi-VN")} đ / {item.unit}
                    </td>
                    <td className="px-6 py-4">
                      <span className={item.stock > 0 ? "text-foreground" : "text-red-500 font-medium"}>
                        {item.stock} {item.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.is_active ? (
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-medium border border-emerald-200">Đang bán</span>
                      ) : (
                        <span className="text-gray-600 bg-gray-50 px-2 py-1 rounded text-xs font-medium border border-gray-200">Ngừng bán</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(item)}>
                        <Edit className="w-4 h-4 mr-2" /> Sửa
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminDataPanel>
    </div>
  )
}
