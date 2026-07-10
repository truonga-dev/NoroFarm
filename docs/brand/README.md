# NoroFarm Brand & Design System

This directory details the UI/UX strategy and design tokens for NoroFarm.

## Design Philosophy
The design is heavily inspired by Apple, Linear, Vercel, Stripe, and Notion. It emphasizes absolute minimalism, premium typography, subtle micro-interactions, and high contrast.

- **Theme:** Supports both Light and Dark modes seamlessly.
- **Component Library:** `shadcn/ui` (accessible and customizable).
- **Animations:** Framer Motion.

## Design Tokens

### Typography
- **Primary Font:** Geist or Inter (Sans-serif).
- **Scale:** Tight leading for headings, relaxed for body.

### Colors
- **Primary:** Emerald/Green (evoking agriculture).
- **Light Mode:** `#FFFFFF` (Background), `#F9FAFB` (Subtle Bg).
- **Dark Mode:** `#0A0A0A` (Background), `#171717` (Subtle Bg).
- **Text:** Slate/Zinc gradients for varying emphasis.

### Layout & Spacing
- **Grid:** 8px base grid.
- **Breakpoints:** `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px).

### Styling Details
- **Radius:** Apple-style smooth corners (`sm`: 4px, `xl`: 16px).
- **Shadow:** Crisp shadows for cards (`shadow-sm`), diffuse for modals (`shadow-2xl`).
- **Icons:** Lucide React.
