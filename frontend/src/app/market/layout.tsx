import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Xu hướng & Biến động Thị trường",
  description: "Phân tích xu hướng tăng giảm của các mặt hàng nông sản, cập nhật dữ liệu Top Movers liên tục.",
  openGraph: {
    title: "Xu hướng Thị trường | NoroFarm",
    description: "Phân tích xu hướng tăng giảm của các mặt hàng nông sản, cập nhật dữ liệu Top Movers liên tục.",
  }
}

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
