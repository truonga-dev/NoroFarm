import { PageTransition } from "@/components/layout/page-transition"
import { MarketTicker } from "@/components/layout/market-ticker"
import { HeroSection } from "@/features/landing/sections/hero-section"
import { QuickOverview } from "@/features/landing/sections/quick-overview"
import { CommodityHighlight } from "@/features/landing/sections/commodity-highlight"
import { WeatherPreview } from "@/features/landing/sections/weather-preview"
import { MarketTrend } from "@/features/landing/sections/market-trend"
import { LatestNews } from "@/features/landing/sections/latest-news"
import { MarketplacePreview } from "@/features/landing/sections/marketplace-preview"
import { FeaturesSection } from "@/features/landing/sections/features-section"
import { WhyChooseUs } from "@/features/landing/sections/why-choose-us"
import { CtaSection } from "@/features/landing/sections/cta-section"
import { API_URL } from "@/api/client"
import { Suspense } from "react"

async function getHomeItems(path: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    })
    if (!response.ok) return []
    const payload = await response.json()
    const items = payload?.data?.items ?? payload?.items ?? payload?.data
    return Array.isArray(items) ? items : []
  } catch {
    // A slow or unavailable API must not hold up navigation to the home page.
    return []
  }
}

function FeedFallback() {
  return <div className="mx-auto h-48 w-full max-w-7xl animate-pulse rounded-2xl bg-muted/40" aria-hidden="true" />
}

async function CommodityFeed() {
  const commodities = await getHomeItems("/commodities?size=4")
  return <CommodityHighlight initialData={commodities} />
}

async function MarketFeed() {
  const marketPosts = await getHomeItems("/market?size=4")
  return <MarketTrend initialData={marketPosts} />
}

async function NewsFeed() {
  const news = await getHomeItems("/news?skip=0&limit=3")
  return <LatestNews initialData={news} />
}

export default function HomePage() {

  return (
    <PageTransition>
      <MarketTicker />
      <div className="flex flex-col gap-16 pb-16 md:gap-24 md:pb-24 pt-4">
        <HeroSection />
        <QuickOverview />
        <Suspense fallback={<FeedFallback />}><CommodityFeed /></Suspense>
        <WeatherPreview />
        <Suspense fallback={<FeedFallback />}><MarketFeed /></Suspense>
        <Suspense fallback={<FeedFallback />}><NewsFeed /></Suspense>
        <MarketplacePreview />
        <FeaturesSection />
        <WhyChooseUs />
        <CtaSection />
      </div>
    </PageTransition>
  )
}
