import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export function Section({ className, children, ...props }: SectionProps) {
  return (
    <section className={cn("py-10 md:py-14 lg:py-16", className)} {...props}>
      {children}
    </section>
  )
}
