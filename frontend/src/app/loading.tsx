import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <Section>
      <Container>
        <div className="space-y-2 pb-8 pt-6 md:pb-12 md:pt-10">
          <Skeleton className="h-10 w-[250px] md:h-12 md:w-[350px]" />
          <Skeleton className="h-6 w-[300px] md:w-[450px]" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </Container>
    </Section>
  )
}
