import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tin tức Nông nghiệp",
  description: "Cập nhật những diễn biến mới nhất về giá cả, xu hướng xuất nhập khẩu và kỹ thuật canh tác nông nghiệp.",
  openGraph: {
    title: "Tin tức Nông nghiệp | NoroFarm",
    description: "Cập nhật những diễn biến mới nhất về giá cả, xu hướng xuất nhập khẩu và kỹ thuật canh tác nông nghiệp.",
  }
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
