# NoroFarm Architecture

This directory contains the system architecture documentation for NoroFarm V1.0.

## Overview
NoroFarm is a modern agricultural digital platform. It utilizes a separated frontend and backend architecture to ensure maximum performance, SEO capabilities, and scalability.

- **Frontend:** Next.js 15 (App Router)
- **Backend:** FastAPI (Python 3.13)
- **Database:** Supabase PostgreSQL
- **Caching:** Redis

## Diagrams

### 1. C4 Context
Describes the interactions between the user, the platform, and external APIs (Weather, Prices, News).

### 2. Container Diagram
Details the separation between the Next.js Frontend, Admin CMS, FastAPI Backend, Database, and Cache.

### 3. Deployment Diagram
Illustrates the deployment topology across Cloudflare, Vercel, Railway, and Supabase.

### 4. Database ERD
Outlines the core domain entities: Commodities, Price History, Articles, Categories, and Users.

For full Mermaid diagrams, please refer to the primary implementation plan.
