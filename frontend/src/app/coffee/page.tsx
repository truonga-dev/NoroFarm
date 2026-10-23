"use client";
 
import { PageTransition } from "@/components/layout/page-transition"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import { PageTitle } from "@/components/layout/page-title"
import { coffeeService } from "@/api/services/coffee.service"
import { commoditiesService } from "@/api/services/commodities.service"
import { useQuery } from "@tanstack/react-query"
import { ArrowUpRight, ArrowDownRight, TrendingUp, Download, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts"

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border bg-card px-3 py-2 shadow-md text-xs">
        <p className="text-muted-foreground mb-0.5">{label}</p>
        <p className="font-bold text-primary">
          {Number(payload[0].value).toLocaleString("vi-VN")} đ
        </p>
      </div>
    )
  }
  return null
}
 
export default function CoffeePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['coffee-data'],
    queryFn: () => coffeeService.getCoffeeData()
  });
 
  const coffeePrices = data?.data?.items || [];
  
  // Lấy ID của khu vực đầu tiên (ví dụ: Đắk Lắk) để lấy lịch sử giá 7 ngày qua
  const firstCoffeeId = coffeePrices[0]?.id;
  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['coffee-history', firstCoffeeId],
    queryFn: async () => {
      const res = await commoditiesService.getPriceHistory(firstCoffeeId, 7);
      return res.data;
    },
    enabled: !!firstCoffeeId
  });

  const history: any[] = historyData?.data || historyData || [];
  const chartData = history.map((h: any) => ({
    date: new Date(h.date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
    price: h.price,
  }));

  const isTrending = history.length > 1 ? (history[history.length - 1].price >= history[0].price) : true;

  return (
    <PageTransition>
      <Section>
        <Container>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <PageTitle 
              title="Bảng giá Cà phê" 
              description="Cập nhật giá cà phê Robusta mới nhất từ các tỉnh Tây Nguyên."
              className="pb-0 pt-0 md:pb-0 md:pt-0"
            />
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Xuất dữ liệu
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center p-8">Đang tải dữ liệu cà phê...</div>
          ) : isError ? (
            <div className="text-center p-8 text-red-500">Đã xảy ra lỗi khi tải dữ liệu cà phê.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl border bg-card overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" /> Lịch sử giá (7 ngày qua)
                    </h2>
                  </div>
                  <div className="p-6 h-[300px]">
                    {isLoadingHistory ? (
                      <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Đang tải biểu đồ...</div>
                    ) : chartData.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <BarChart2 className="w-10 h-10 opacity-20" />
                        <p className="text-sm">Chưa có dữ liệu lịch sử giá cho khu vực này</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 5, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="coffeeGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={isTrending ? "#16a34a" : "#ef4444"} stopOpacity={0.2} />
                              <stop offset="95%" stopColor={isTrending ? "#16a34a" : "#ef4444"} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                          <XAxis
                            dataKey="date"
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                            axisLine={false} tickLine={false}
                          />
                          <YAxis
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                            axisLine={false} tickLine={false}
                            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                            width={42} domain={["auto", "auto"]}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke={isTrending ? "#16a34a" : "#ef4444"}
                            strokeWidth={2.5}
                            fill="url(#coffeeGradient)"
                            dot={false}
                            activeDot={{ r: 5, strokeWidth: 0 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border bg-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted/50 border-b">
                        <tr>
                          <th className="px-6 py-4 font-semibold">Khu vực</th>
                          <th className="px-6 py-4 font-semibold">Giá (VNĐ/kg)</th>
                          <th className="px-6 py-4 font-semibold">Thay đổi</th>
                          <th className="px-6 py-4 font-semibold">Cập nhật</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coffeePrices.map((item: any) => {
                          // Mocking price changes for UI
                          const isUp = Math.random() > 0.5;
                          const change = Math.floor(Math.random() * 2000);
                          return (
                            <tr key={item.id} className="border-b last:border-0 hover:bg-muted/20">
                              <td className="px-6 py-4 font-medium">{item.name}</td>
                              <td className="px-6 py-4 font-bold text-lg">{item.current_price ? item.current_price.toLocaleString() : 'N/A'}</td>
                              <td className={cn("px-6 py-4 font-medium", isUp ? "text-emerald-500" : "text-rose-500")}>
                                <div className="flex items-center gap-1">
                                  {isUp ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                  {change.toLocaleString()} đ
                                </div>
                              </td>
                              <td className="px-6 py-4 text-muted-foreground">{new Date(item.updated_at).toLocaleDateString()}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            <div className="space-y-6">
              <div className="rounded-2xl border bg-card p-6">
                <h3 className="font-bold mb-4">Tổng quan thị trường</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Giá trung bình</span>
                    <span className="font-bold">105,200 đ/kg</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Mức cao nhất</span>
                    <span className="font-bold text-emerald-500">105,500 đ/kg</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Mức thấp nhất</span>
                    <span className="font-bold text-rose-500">104,800 đ/kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </Container>
      </Section>
    </PageTransition>
  )
}
