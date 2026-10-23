"use client"

import * as React from "react"
import { ThemeProvider } from "./theme-provider"
import { QueryProvider } from "./query-provider"
import { ToastProvider } from "@/components/ui/toast-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}
