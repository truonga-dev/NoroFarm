import { PageTransition } from '@/components/layout/page-transition'
import { MarketTicker } from '@/components/layout/market-ticker'
import { HeroSection } from '@/features/landing/sections/hero-section'
import { QuickOverview } from '@/features/landing/sections/quick-overview'
import { CommodityHighlight } from '@/features/landing/sections/commodity-highlight'
import { WeatherPreview } from '@/features/landing/sections/weather-preview'
import { MarketTrend } from '@/features/landing/sections/market-trend'
import { LatestNews } from '@/features/landing/sections/latest-news'
import { FeaturesSection } from '@/features/landing/sections/features-section'
import { WhyChooseUs } from '@/features/landing/sections/why-choose-us'
import { CtaSection } from '@/features/landing/sections/cta-section'
import { PlatformDirectory } from '@/features/landing/sections/platform-directory'
import { API_URL } from '@/api/client'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

async function getHomeItems(path: string): Promise<any[]> {
  try {
    const isServer = typeof window === 'undefined'
    const baseUrl = isServer
      ? (process.env.INTERNAL_API_URL || 'http://backend:8000/api/v1')
      : (API_URL.startsWith('http') ? API_URL : `${window.location.origin}${API_URL}`)
    const fullUrl = API_URL.startsWith('http') ? `${API_URL}${path}` : `${baseUrl}${path}`

    const response = await fetch(fullUrl, {
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
  return (
    <div
      className="bg-muted/40 mx-auto h-48 w-full max-w-7xl animate-pulse rounded-2xl"
      aria-hidden="true"
    />
  )
}

async function CommodityFeed() {
  const commodities = await getHomeItems('/commodities?page=1&size=4')
  return <CommodityHighlight initialData={commodities} />
}

async function MarketFeed() {
  const marketPosts = await getHomeItems('/market?page=1&size=4')
  return <MarketTrend initialData={marketPosts} />
}

async function NewsFeed() {
  const news = await getHomeItems('/news?page=1&size=3')
  return <LatestNews initialData={news} />
}

export default function HomePage() {
  return (
    <PageTransition>
      <MarketTicker />
      <div className="flex flex-col gap-12 pb-16 md:gap-20 md:pb-24">
        <HeroSection />
        <QuickOverview />
        <Suspense fallback={<FeedFallback />}>
          <CommodityFeed />
        </Suspense>
        <WeatherPreview />
        <Suspense fallback={<FeedFallback />}>
          <MarketFeed />
        </Suspense>
        <Suspense fallback={<FeedFallback />}>
          <NewsFeed />
        </Suspense>
        <PlatformDirectory />
        <CtaSection />
      </div>
    </PageTransition>
  )
}
