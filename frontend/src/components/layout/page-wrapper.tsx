import * as React from "react"
import { cn } from "@/lib/utils"

interface PageWrapperProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PageWrapper({ className, children, ...props }: PageWrapperProps) {
  return (
    <div
      className={cn("flex min-h-screen flex-col", className)}
      {...props}
    >
      <main className="flex-1">{children}</main>
    </div>
  )
}
