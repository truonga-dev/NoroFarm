'use client'

import * as React from 'react'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NoroFarmAiLogoProps {
  size?: number
  showText?: boolean
  title?: string
  badgeText?: string
  className?: string
  subtitle?: string
  showSparkleBadge?: boolean
}

export function NoroFarmAiLogo({
  size = 40,
  showText = false,
  title = 'NoroFarm',
  badgeText,
  className,
  subtitle = 'Cố vấn Nông nghiệp & Thị trường',
  showSparkleBadge = false,
}: NoroFarmAiLogoProps) {
  return (
    <div className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <div
        className="relative flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-800 to-slate-950 p-1 shadow-lg ring-1 ring-emerald-400/40"
        style={{ width: size, height: size }}
      >
        <Image
          src="/norofarm-ai-logo.svg"
          alt="NoroFarm Logo"
          width={size}
          height={size}
          className="h-full w-full object-contain"
          priority
        />
        {showSparkleBadge && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow">
            <Sparkles className="h-2 w-2" />
          </span>
        )}
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="text-white text-base font-bold tracking-tight">{title}</span>
            {badgeText && (
              <span className="rounded-md border border-emerald-500/40 bg-emerald-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300 shadow-sm">
                {badgeText}
              </span>
            )}
          </div>
          {subtitle && (
            <span className="text-slate-300 text-[11px] font-medium">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  )
}
