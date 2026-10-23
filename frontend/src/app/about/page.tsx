import { PageTransition } from "@/components/layout/page-transition"
import { Section } from "@/components/layout/section"
import { Container } from "@/components/layout/container"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Giới thiệu NoroFarm",
}

export default function AboutPage() {
  return (
    <PageTransition>
      <Section className="py-20 bg-muted/30">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Về NoroFarm
            </h1>
            <p className="text-xl text-muted-foreground">
              Hành trình số hóa nông nghiệp Việt Nam
            </p>
          </div>
        </Container>
      </Section>
      
      <Section>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Câu chuyện của chúng tôi</h2>
              <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Xuất phát từ nỗi trăn trở của những người con sinh ra và lớn lên tại mảnh đất Tây Nguyên đầy nắng gió. Chứng kiến sự bấp bênh của giá cả nông sản, sự khó lường của thời tiết và những khó khăn trong việc tiếp cận thông tin của bà con nông dân.
                </p>
                <p>
                  NoroFarm ra đời không chỉ là một ứng dụng xem giá, mà là một nền tảng dữ liệu toàn diện. Chúng tôi tin rằng, minh bạch thông tin là chìa khóa để nâng cao vị thế của người nông dân.
                </p>
              </div>
            </div>
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-emerald-500/20 rounded-[3rem] p-8 relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595856417531-15b5b9c08c4e?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center rounded-[3rem] opacity-60 mix-blend-overlay" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-24">
            <div className="p-8 rounded-3xl bg-card border shadow-sm">
              <div className="h-12 w-12 bg-primary/10 text-primary flex items-center justify-center rounded-xl font-bold text-xl mb-6">
                M
              </div>
              <h3 className="text-2xl font-bold mb-4">Sứ mệnh (Mission)</h3>
              <p className="text-muted-foreground">
                Cung cấp hệ sinh thái thông tin nông nghiệp chính xác, nhanh chóng và miễn phí. Giúp người nông dân giảm rủi ro canh tác và tối đa hóa lợi nhuận mùa vụ.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-card border shadow-sm">
              <div className="h-12 w-12 bg-blue-500/10 text-blue-500 flex items-center justify-center rounded-xl font-bold text-xl mb-6">
                V
              </div>
              <h3 className="text-2xl font-bold mb-4">Tầm nhìn (Vision)</h3>
              <p className="text-muted-foreground">
                Trở thành nền tảng nông nghiệp công nghệ cao (AgriTech) số 1 Đông Nam Á vào năm 2030, kết nối hàng triệu nông dân với chuỗi cung ứng toàn cầu.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </PageTransition>
  )
}
