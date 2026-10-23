import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Giá Nông Sản Tổng Hợp",
  description: "Cập nhật giá các mặt hàng nông sản như Cà phê, Hồ tiêu, Lúa gạo... với biểu đồ và dữ liệu chi tiết.",
  openGraph: {
    title: "Giá Nông Sản Tổng Hợp | NoroFarm",
    description: "Cập nhật giá các mặt hàng nông sản như Cà phê, Hồ tiêu, Lúa gạo... với biểu đồ và dữ liệu chi tiết.",
  }
}

export default function CommoditiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
