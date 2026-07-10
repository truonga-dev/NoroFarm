# NoroFarm API Strategy

This directory contains the documentation for the backend API strategy and integration patterns.

## Overview
The API is built with FastAPI (Python 3.13) and follows a RESTful architecture. It aggregates data from various external sources (Weather, Commodity Prices, News RSS) using a standardized Provider Pattern.

## Provider Pattern
To ensure flexibility and scalability, external data fetching is abstracted behind Provider interfaces. This allows swapping a weather or news provider without affecting the core business logic.

- **Interfaces:** `backend/app/core/interfaces/`
- **Implementations:** `backend/app/services/providers/`

## Caching Strategy
- **High-frequency (Prices):** Redis caching with a short TTL (1-5 minutes).
- **Medium-frequency (Weather):** Grid-based coordinate caching (15-30 minutes).
- **Low-frequency (News):** Polled via background scheduler and stored persistently in Supabase PostgreSQL.

## Core Endpoints (V1)
- `GET /api/v1/prices/coffee`
- `GET /api/v1/prices/commodities`
- `GET /api/v1/weather`
- `GET /api/v1/news`
- `GET /api/v1/market-trends`
- `GET /api/v1/search`
