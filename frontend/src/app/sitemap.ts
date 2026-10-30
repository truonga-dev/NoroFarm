import { MetadataRoute } from 'next'
import { API_URL } from '@/api/client'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://norofarm.com'
  
  // 1. Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: `${baseUrl}/coffee`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/commodities`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/weather`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.8 },
    { url: `${baseUrl}/market`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/marketplace`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  // 2. Fetch published news articles
  let newsRoutes: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${API_URL}/news?size=100`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(3000),
    }).catch(() => null)
    if (res && res.ok) {
      const data = await res.json()
      const articles = data?.data?.items || data?.items || []
      newsRoutes = articles
        .filter((article: any) => article.slug)
        .map((article: any) => ({
          url: `${baseUrl}/news/${article.slug}`,
          lastModified: new Date(article.updated_at || article.created_at || Date.now()),
          changeFrequency: 'daily' as const,
          priority: 0.7,
        }))
    }
  } catch (e) {
    // Graceful fallback if backend is unreachable during static build
  }

  // 3. Fetch active agricultural commodities
  let commodityRoutes: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${API_URL}/commodities?size=100`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(3000),
    }).catch(() => null)
    if (res && res.ok) {
      const data = await res.json()
      const items = data?.data?.items || data?.items || []
      commodityRoutes = items
        .filter((item: any) => item.id)
        .map((item: any) => ({
          url: `${baseUrl}/commodities/${item.id}`,
          lastModified: new Date(),
          changeFrequency: 'hourly' as const,
          priority: 0.8,
        }))
    }
  } catch (e) {
    // Graceful fallback
  }

  return [...staticRoutes, ...newsRoutes, ...commodityRoutes]
}
