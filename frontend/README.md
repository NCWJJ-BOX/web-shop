# Web Shop

แอปตัวอย่าง e-commerce แบบ full-stack (Frontend + Backend + Postgres) พร้อม flow ลูกค้า (สั่งซื้อ/อัปโหลดสลิป) และ Admin dashboard (อนุมัติการชำระเงิน/จัดการสินค้า/ติดตามการจัดส่ง)

Tech stack:
- Frontend: Vite + React + TypeScript
- Backend: Express + Prisma
- DB: Postgres
- Run locally: Docker Compose

## Screenshots

### Customer

![Customer - Home](_legacy_root/img/Screenshot%202026-03-05%20190427.png)

![Customer - Products](_legacy_root/img/Screenshot%202026-03-05%20190433.png)

![Customer - Cart](_legacy_root/img/Screenshot%202026-03-05%20190442.png)

![Customer - Checkout](_legacy_root/img/Screenshot%202026-03-05%20190451.png)

![Customer - Upload payment slip](_legacy_root/img/Screenshot%202026-03-05%20190505.png)

### Admin

![Admin - Products management](_legacy_root/img/Screenshot%202026-03-05%20190346.png)

![Admin - Orders management](_legacy_root/img/Screenshot%202026-03-05%20190414.png)

![Admin - Payments review](_legacy_root/img/Screenshot%202026-03-05%20190402.png)

![Admin - Sales overview](_legacy_root/img/Screenshot%202026-03-05%20190357.png)

## Quick Start

```bash
docker compose up -d --build
```

เปิดใช้งาน:
- Frontend: http://localhost:5173
 - Backend health: http://localhost:3002/api/health

## Admin Dashboard

หน้า Admin (เมนู sidebar ซ้าย):
- Sales: `/admin`
- Payments (ตรวจสลิป): `/admin/payments`
- Orders (สถานะจัดส่ง/Tracking): `/admin/orders`
- Products (เพิ่ม/แก้ไข/ปิดการขาย/สต็อก): `/admin/products`

ผู้ใช้ Admin เริ่มต้น (seed ตอน start):
- Email: `admin@store.local`
- Password: `admin1234`

เปลี่ยน credentials โดย export env ก่อนรัน compose:

```bash
export ADMIN_EMAIL="admin@example.com"
export ADMIN_PASSWORD="change_me"
export JWT_SECRET="change_me"
docker compose up -d --build
```

## Customer Flow

1. Register / Login
2. Add products to cart
3. Checkout (สร้าง Order)
4. อัปโหลดรูปสลิปการชำระเงิน
5. Admin อนุมัติ/ปฏิเสธการชำระเงิน

Notes:
- Upload สลิปจะตั้งสถานะเป็น `PAYMENT_SUBMITTED`
- Admin อนุมัติจะตั้งสถานะเป็น `PAID`
- Admin ปฏิเสธต้องใส่เหตุผล และคืนสต็อกที่ reserve ไว้

## Project Structure

```
backend/          # Express + Prisma + Postgres
frontend/         # Vite + React + TS
  _legacy_root/   # legacy root app files + screenshots
docker-compose.yml
```

## Uploads

- Payment slips served at `GET /uploads/...`
- Product images อัปโหลดจากหน้า Admin (เก็บไว้ที่ `/uploads/products/...`)

## Troubleshooting

- ถ้าเข้าหน้าเว็บผ่าน LAN IP (เช่น `http://192.168.x.x:5173`) ให้ตั้ง `VITE_API_URL=http://<host-ip>:3002` ก่อนรัน compose (ค่า default ใน `docker-compose.yml` คือ `http://localhost:3002`)
