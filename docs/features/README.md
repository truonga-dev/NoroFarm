# NoroFarm Features & CMS Modules

This directory contains specifications for the public-facing features and the internal Admin CMS.

## Public Platform (V1.0)
- **Landing Page:** Premium introduction to the platform.
- **Coffee Prices:** Real-time and historical pricing data.
- **Agricultural Commodity Prices:** Data for Durian, Avocado, Macadamia, Rubber, Pepper, Rice, and Fruit.
- **Weather:** Location-specific agricultural forecasts.
- **News:** Aggregated agricultural industry news.
- **Market Trends:** In-depth analysis and charts.
- **Marketplace Redirect:** Links to existing marketplace (backend not included in V1).
- **Search:** Unified global search.

## Admin CMS Modules
A dedicated section (Next.js route group) for platform management.

1. **News:** Create, edit, publish articles.
2. **Commodity Prices:** Override prices, manage history.
3. **Weather Source:** Configure API keys and regions.
4. **Banner:** Global alerts and promotions.
5. **Homepage:** Reorder components and featured items.
6. **Categories:** Manage taxonomy.
7. **Users:** Role-based access control (RBAC).
8. **Settings:** Global SEO and platform configs.

## SEO Architecture
- Dynamic Metadata API
- OpenGraph & Twitter Cards
- JSON-LD structured data
- Dynamic `robots.txt` and `sitemap.xml`
- RSS Feed generation
