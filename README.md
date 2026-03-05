# Web Shop (Frontend + Backend + Postgres)

This repo is a full-stack demo e-commerce app.

## Quick Start

```bash
docker compose up -d --build
```

Open:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001/api/health

## Project Structure

```
frontend/   # Vite + React + TS
backend/    # Express + Prisma + Postgres
docker-compose.yml
```

## Admin Dashboard

Admin pages (left sidebar dashboard):
- Sales: `/admin`
- Payments (slip review): `/admin/payments`
- Orders (shipping/tracking): `/admin/orders`
- Products (add/edit/disable, stock): `/admin/products`

Default admin user (seeded at startup):
- Email: `admin@store.local`
- Password: `admin1234`

Change credentials by exporting env vars before compose:

```bash
export ADMIN_EMAIL="admin@example.com"
export ADMIN_PASSWORD="change_me"
export JWT_SECRET="change_me"
docker compose up -d --build
```

## Customer Flow

1. Register / Login
2. Add products to cart
3. Checkout (creates an order)
4. Upload a payment slip image
5. Admin approves/rejects the payment

Notes:
- Slip upload sets order status to `PAYMENT_SUBMITTED`.
- Admin approval sets order to `PAID`.
- Admin rejection requires a reason and returns reserved stock.

## Uploads

- Payment slips are served from `GET /uploads/...`.
- Product images can be uploaded from admin (stored under `/uploads/products/...`).

## Troubleshooting

- If you access the frontend via a LAN IP (e.g. `http://192.168.x.x:5173`), the frontend automatically calls the backend at `http://<same-host>:3001`.
