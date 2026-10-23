import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Thời Tiết Nông Nghiệp",
  description: "Dự báo thời tiết chi tiết tại các vùng trồng trọt trọng điểm: Tây Nguyên, Đông Nam Bộ, Tây Nam Bộ...",
  openGraph: {
    title: "Thời Tiết Nông Nghiệp | NoroFarm",
    description: "Dự báo thời tiết chi tiết tại các vùng trồng trọt trọng điểm: Tây Nguyên, Đông Nam Bộ, Tây Nam Bộ...",
  }
}

export default function WeatherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
