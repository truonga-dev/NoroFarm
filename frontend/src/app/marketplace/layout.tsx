import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sàn giao dịch nông sản | NoroFarm",
  description: "Tìm tin mua và bán nông sản đã được duyệt, so sánh giá chào, số lượng và khu vực giao dịch.",
}

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children
}
