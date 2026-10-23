"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function NavigationFeedback() {
  const pathname = usePathname()
  const [pending, setPending] = useState(false)

  useEffect(() => {
    setPending(false)
  }, [pathname])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = event.target
      if (!(target instanceof Element)) return
      const link = target.closest<HTMLAnchorElement>("a[href]")
      if (!link || link.hasAttribute("download") || (link.getAttribute("target") && link.getAttribute("target") !== "_self")) return

      const destination = new URL(link.href, window.location.href)
      if (destination.origin === window.location.origin && destination.pathname !== window.location.pathname) {
        setPending(true)
      }
    }

    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])

  useEffect(() => {
    if (!pending) return
    const timeout = window.setTimeout(() => setPending(false), 10000)
    return () => window.clearTimeout(timeout)
  }, [pending])

  if (!pending) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden bg-primary/15" role="status" aria-label="Đang chuyển trang">
      <div className="navigation-progress h-full w-1/3 bg-primary" />
    </div>
  )
}
