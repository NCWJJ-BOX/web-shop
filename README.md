# Web Shop

Full-stack e-commerce platform with React/Vite frontend and Express/TypeScript backend. Complete order lifecycle with payment slip review workflow.

## Features

- Product catalog with categories, search, featured items, discounts, stock management
- Full order lifecycle: PENDING_PAYMENT → PAYMENT_SUBMITTED → PAID → PACKED → SHIPPED → DELIVERED
- Payment slip upload and admin review (approve/reject with notes)
- Shipment tracking
- Admin dashboard with stats, product/category/order/payment management
- JWT authentication with customer and admin roles
- Rate limiting and security headers (helmet)

## Tech Stack

- **Frontend:** React 18, Vite 5, TypeScript, Tailwind CSS 3, Framer Motion, Supabase JS
- **Backend:** Express 4, TypeScript, Prisma (PostgreSQL), bcryptjs, JWT, helmet, multer
- **Database:** PostgreSQL 16
- **Deployment:** Docker Compose, Vercel

## Project Structure

```
web-shop/
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Routes: store + admin pages
│   │   ├── pages/
│   │   │   ├── StorePage.tsx     # Customer store
│   │   │   └── admin/            # Stats, Products, Orders, Payments, Categories
│   │   ├── components/           # Reusable components
│   │   ├── hooks/                # Custom hooks
│   │   └── api/                  # API client
│   └── Dockerfile
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server
│   │   ├── routes/               # auth, orders, admin routers
│   │   ├── middleware/           # Auth, error handling
│   │   └── utils/                # Helpers
│   ├── prisma/schema.prisma     # Full e-commerce schema
│   └── Dockerfile
├── docker-compose.yml
└── supabase-migration.sql
```

## Setup

```bash
# Docker Compose (recommended)
docker-compose up
# Frontend: http://localhost:5173
# Backend: http://localhost:3002

# Manual
cd backend && npm install && npx prisma generate && npm run dev
cd frontend && npm install && npm run dev
```

## Environment Variables

**Backend** (`.env`):
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
```

## Demo

https://shop-show-case.box-dex.win/
