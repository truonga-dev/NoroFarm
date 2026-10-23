import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number | string,
  currency: "VND" | "USD" = "VND",
  notation: "standard" | "compact" = "standard"
) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 0,
  }).format(Number(price))
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value)
}

export function formatDate(date: string | Date | number) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date | number) {
  const rtf = new Intl.RelativeTimeFormat("vi-VN", { numeric: "auto" })
  const daysDifference = Math.round(
    (new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )
  
  if (Math.abs(daysDifference) < 1) {
    const hours = Math.round(
      (new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60)
    )
    if (Math.abs(hours) < 1) {
      const minutes = Math.round(
        (new Date(date).getTime() - new Date().getTime()) / (1000 * 60)
      )
      return rtf.format(minutes, "minute")
    }
    return rtf.format(hours, "hour")
  }
  
  return rtf.format(daysDifference, "day")
}
