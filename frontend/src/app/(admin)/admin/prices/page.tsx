"use client"

import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Search, Edit, Trash2, Tag, Scale, TrendingUp, TrendingDown, ArrowRight, Upload } from "lucide-react"
import Papa from "papaparse"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { commoditiesService } from "@/api/services/commodities.service"
import { useToast } from "@/components/ui/toast-context"

export default function AdminPricesPage() {
  const [search, setSearch] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("all")
  const [page, setPage] = React.useState(1)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingPriceId, setEditingPriceId] = React.useState<number | null>(null)
  const [newPrice, setNewPrice] = React.useState("")
  
  // Form State
  const [formData, setFormData] = React.useState({
    code: "", name: "", unit: "", category_id: 1, description: ""
  })

  const queryClient = useQueryClient()
  const toast = useToast()

  const { data, isLoading } = useQuery({
    queryKey: ["admin-commodities-list", page, search],
    queryFn: () => commoditiesService.getCommodities({ page, size: 20, search })
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => commoditiesService.deleteCommodity(id),
    onSuccess: () => {
      toast.success("Đã xóa mặt hàng")
      queryClient.invalidateQueries({ queryKey: ["admin-commodities-list"] })
    },
    onError: () => {
      toast.error("Lỗi khi xóa mặt hàng")
    }
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => commoditiesService.createCommodity(data),
    onSuccess: () => {
      toast.success("Đã thêm mặt hàng mới")
      setIsDialogOpen(false)
      setFormData({ code: "", name: "", unit: "", category_id: 1, description: "" })
      queryClient.invalidateQueries({ queryKey: ["admin-commodities-list"] })
    },
    onError: () => {
      toast.error("Lỗi khi thêm mặt hàng")
    }
  })

  const addPriceMutation = useMutation({
    mutationFn: ({ id, price }: { id: number, price: number }) => commoditiesService.addCommodityPrice(id, { commodity_id: id, price }),
    onSuccess: () => {
      toast.success("Cập nhật giá thành công")
      setEditingPriceId(null)
      queryClient.invalidateQueries({ queryKey: ["admin-commodities-list"] })
    },
    onError: () => {
      toast.error("Lỗi khi cập nhật giá")
    }
  })

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa mặt hàng này? Toàn bộ dữ liệu giá sẽ bị xóa!")) {
      deleteMutation.mutate(id)
    }
  }

  const items = data?.data?.items || []
  
  const bulkAddMutation = useMutation({
    mutationFn: (prices: any[]) => commoditiesService.bulkAddPrices({ prices }),
    onSuccess: (res: any) => {
      toast.success(res?.data?.message || "Nhập giá hàng loạt thành công")
      queryClient.invalidateQueries({ queryKey: ["admin-commodities-list"] })
    },
    onError: () => {
      toast.error("Lỗi khi nhập giá hàng loạt")
    }
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data as any[]
        // Map CSV rows (expected columns: code, price) to API payload
        const newPrices: any[] = []
        let notFoundCodes: string[] = []
        
        parsedData.forEach(row => {
          if (!row.code || !row.price) return
          const commodity = items.find((c: any) => c.code === row.code || c.name === row.code)
          if (commodity) {
            newPrices.push({
              commodity_id: commodity.id,
              price: parseFloat(row.price.replace(/,/g, '')),
              currency: row.currency || "VND"
            })
          } else {
            notFoundCodes.push(row.code)
          }
        })

        if (newPrices.length > 0) {
          bulkAddMutation.mutate(newPrices)
          if (notFoundCodes.length > 0) {
            toast.success(`Đã bỏ qua các mã không tồn tại: ${notFoundCodes.join(', ')}`)
          }
        } else {
          toast.error("Không tìm thấy dữ liệu hợp lệ trong file CSV. File cần có cột 'code' và 'price'.")
        }
        
        // Reset input
        e.target.value = ""
      },
      error: () => {
        toast.error("Lỗi khi đọc file CSV")
      }
    })
  }
  
  // Filter by category logic (Mocking since API doesn't have it natively yet)
  const filteredItems = items.filter((item: any) => {
    if (activeTab === "all") return true;
    if (activeTab === "coffee" && item.name.toLowerCase().includes("cà phê")) return true;
    if (activeTab === "fruit" && !item.name.toLowerCase().includes("cà phê")) return true;
    return false;
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const handleSavePrice = (id: number) => {
    if (!newPrice) return
    addPriceMutation.mutate({ id, price: parseFloat(newPrice) })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý Giá Nông sản</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Quản lý và cập nhật giá các mặt hàng nông sản trên thị trường
          </p>
        </div>
        
        <div className="flex gap-2 items-center">
          <div>
            <Label htmlFor="csv-upload" className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 shadow-sm">
              <Upload className="w-4 h-4 mr-2" />
              {bulkAddMutation.isPending ? "Đang xử lý..." : "Nhập CSV"}
            </Label>
            <input 
              type="file" 
              id="csv-upload" 
              accept=".csv" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={bulkAddMutation.isPending}
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 shadow-md">
                <Plus className="w-4 h-4 mr-2" />
                Thêm mặt hàng
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl">Thêm Nông sản mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Mã nông sản</Label>
                    <Input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="VD: CF-ROB" className="bg-muted/50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Danh mục</Label>
                    <select 
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.category_id}
                      onChange={e => setFormData({...formData, category_id: parseInt(e.target.value)})}
                    >
                      <option value={1}>Cà phê</option>
                      <option value={2}>Hạt điều</option>
                      <option value={3}>Tiêu</option>
                      <option value={4}>Trái cây</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tên mặt hàng</Label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="VD: Cà phê Robusta" className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Đơn vị tính</Label>
                  <Input required value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} placeholder="VD: VNĐ/kg" className="bg-muted/50" />
                </div>
                <div className="pt-2 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                  <Button type="submit" disabled={createMutation.isPending} className="gap-2">
                    {createMutation.isPending ? "Đang lưu..." : "Lưu mặt hàng"} <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-background p-4 rounded-xl border shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-3 h-10">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="coffee">Cà phê</TabsTrigger>
            <TabsTrigger value="fruit">Nông sản khác</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Tìm kiếm mặt hàng..." 
            className="pl-9 h-10 bg-muted/50 border-transparent focus-visible:ring-1 focus-visible:bg-background transition-all"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>
      </div>

      <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Mặt hàng</th>
                <th className="px-6 py-4 whitespace-nowrap">Đơn vị</th>
                <th className="px-6 py-4 whitespace-nowrap">Giá cập nhật gần nhất</th>
                <th className="px-6 py-4 whitespace-nowrap">Xu hướng</th>
                <th className="px-6 py-4 whitespace-nowrap text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-40" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-20" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-16" /></td>
                    <td className="px-6 py-4 flex justify-end gap-2"><Skeleton className="h-8 w-8 rounded-md" /></td>
                  </tr>
                ))
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    Không tìm thấy mặt hàng nào.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item: any) => {
                  const sortedPrices = item.prices ? [...item.prices].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];
                  const latestPrice = sortedPrices[0];
                  const previousPrice = sortedPrices[1];
                  
                  let trend = null;
                  let trendPercent = "0.0%";
                  if (latestPrice && previousPrice && previousPrice.price > 0) {
                    const diff = latestPrice.price - previousPrice.price;
                    trend = diff > 0 ? "up" : diff < 0 ? "down" : "flat";
                    trendPercent = ((Math.abs(diff) / previousPrice.price) * 100).toFixed(1) + "%";
                  }

                  return (
                  <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{item.name}</div>
                      {item.symbol && <div className="text-xs text-muted-foreground mt-0.5">{item.symbol}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Scale className="w-3.5 h-3.5" />
                        {item.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingPriceId === item.id ? (
                        <div className="flex items-center gap-2">
                          <Input 
                            autoFocus
                            className="h-8 w-24" 
                            placeholder="Nhập giá..." 
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSavePrice(item.id)
                              if (e.key === 'Escape') setEditingPriceId(null)
                            }}
                          />
                          <Button size="sm" className="h-8 px-2" onClick={() => handleSavePrice(item.id)}>Lưu</Button>
                        </div>
                      ) : (
                        item.prices && item.prices.length > 0 ? (
                          <div>
                            <div className="font-medium text-lg text-emerald-600 dark:text-emerald-400">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(latestPrice.price)}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {new Date(latestPrice.date).toLocaleString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium text-lg text-emerald-600">--</div>
                            <div className="text-xs text-muted-foreground mt-0.5">Chưa có dữ liệu</div>
                          </div>
                        )
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {trend ? (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                          trend === 'up' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 
                          trend === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : trend === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> : null}
                          {trend === 'flat' ? '---' : `${trend === 'up' ? '+' : '-'}${trendPercent}`}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                          Chưa có xu hướng
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setEditingPriceId(item.id)
                            setNewPrice("")
                          }}
                        >
                          Cập nhật giá
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
