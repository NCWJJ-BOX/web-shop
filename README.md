# Web Shop

Full-stack e-commerce showcase built with React/Vite and Supabase. Deployed on Vercel.

## Features

- Product catalog with categories, search, featured items, discounts, stock management
- Full order lifecycle: PENDING_PAYMENT -> PAYMENT_SUBMITTED -> PAID -> PACKED -> SHIPPED -> DELIVERED
- Payment slip upload and admin review (approve/reject with notes)
- Shipment tracking
- Admin dashboard with stats, product/category/order/payment management
- Supabase Auth with customer and admin roles
- Row Level Security (RLS) for data access control

## Tech Stack

- **Frontend:** React 18, Vite 5, TypeScript, Tailwind CSS 3, Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Deployment:** Vercel

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
│   │   ├── hooks/                # Custom hooks (useAuth, useCart, useWishlist)
│   │   └── lib/                  # Supabase client, DB queries, Order functions, Admin functions
│   └── Dockerfile
├── supabase-migration.sql        # Full database schema + RLS policies + seed data
├── vercel.json
└── README.md
```

## Setup

### 1. Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `supabase-migration.sql`
3. Go to Storage and verify `payment-slips` bucket exists (created by migration)
4. Go to Settings > API and copy:
   - Project URL
   - Publishable Key (anon public key)

### 2. Environment Variables

Create `frontend/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### 3. Create Admin User

In Supabase Authentication > Users, create a user with these metadata:

```json
{
  "name": "Admin",
  "role": "ADMIN"
}
```

### 4. Run Locally

```bash
cd frontend
npm install
npm run dev
```

### 5. Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Set environment variables in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Order Flow

1. Customer browses products, adds to cart
2. Checkout requires authentication (Supabase Auth)
3. Customer fills shipping info and creates order
4. Customer uploads payment slip (stored in Supabase Storage)
5. Admin reviews payment slip (approve/reject with notes)
6. Admin manages order status and shipment tracking

## Database

All tables use Row Level Security (RLS):
- **Category/Product:** Public read, admin full access
- **Order/OrderItem:** Users see own orders, admin full access
- **Payment/Shipment:** Users see own, admin full access
- **Storage:** Users upload own slips, public read

Seed data includes 6 categories and 6 products.
