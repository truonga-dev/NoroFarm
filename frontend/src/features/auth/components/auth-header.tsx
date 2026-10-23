"use client"

import Link from "next/link"
import { Sprout } from "lucide-react"
import { motion } from "framer-motion"

interface AuthHeaderProps {
  title: string
  description: string
  backLink?: string
  backLabel?: string
}

export function AuthHeader({
  title,
  description,
  backLink,
  backLabel,
}: AuthHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col space-y-2 text-center mb-8"
    >
      {/* Logo */}
      <Link href="/" className="inline-flex items-center justify-center gap-2.5 mb-5 mx-auto group">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
          <Sprout className="h-5 w-5 text-primary" />
        </div>
        <span className="text-2xl font-bold tracking-tight">NoroFarm</span>
      </Link>

      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>

      {backLink && backLabel && (
        <Link
          href={backLink}
          className="text-sm text-primary hover:text-primary/80 transition-colors mt-1 inline-block"
        >
          {backLabel}
        </Link>
      )}
    </motion.div>
  )
}
