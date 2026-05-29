-- WebShop Supabase Migration
-- Run this in Supabase SQL Editor

-- ============================================
-- TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "icon" TEXT NOT NULL DEFAULT '',
  "count" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Product" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "originalPrice" DOUBLE PRECISION,
  "image" TEXT NOT NULL,
  "images" TEXT[] DEFAULT '{}',
  "categoryId" TEXT,
  "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reviews" INTEGER NOT NULL DEFAULT 0,
  "description" TEXT NOT NULL DEFAULT '',
  "features" TEXT[] DEFAULT '{}',
  "inStock" BOOLEAN NOT NULL DEFAULT true,
  "stockQty" INTEGER NOT NULL DEFAULT 50,
  "discount" INTEGER,
  "isNew" BOOLEAN DEFAULT false,
  "isFeatured" BOOLEAN DEFAULT false,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Order" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "orderNo" TEXT NOT NULL,
  "userId" UUID NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
  "currency" TEXT NOT NULL DEFAULT 'THB',
  "subtotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "shippingFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "shippingName" TEXT NOT NULL DEFAULT '',
  "shippingPhone" TEXT NOT NULL DEFAULT '',
  "shippingAddress" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "Order_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Order_orderNo_key" UNIQUE ("orderNo")
);

CREATE TABLE IF NOT EXISTS "OrderItem" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "orderId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "lineTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
  CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Payment" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "orderId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
  "slipPath" TEXT NOT NULL DEFAULT '',
  "slipMime" TEXT NOT NULL DEFAULT '',
  "slipOriginalName" TEXT NOT NULL DEFAULT '',
  "slipSize" INTEGER NOT NULL DEFAULT 0,
  "submittedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "approvedAt" TIMESTAMPTZ,
  "reviewedAt" TIMESTAMPTZ,
  "reviewNote" TEXT,
  CONSTRAINT "Payment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "Shipment" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "orderId" TEXT NOT NULL,
  "carrier" TEXT,
  "trackingNo" TEXT,
  "shippedAt" TIMESTAMPTZ,
  "deliveredAt" TIMESTAMPTZ,
  CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Shipment_orderId_key" UNIQUE ("orderId"),
  CONSTRAINT "Shipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order"("userId");
CREATE INDEX IF NOT EXISTS "Order_status_idx" ON "Order"("status");
CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX IF NOT EXISTS "Payment_orderId_idx" ON "Payment"("orderId");
CREATE INDEX IF NOT EXISTS "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX IF NOT EXISTS "Product_isActive_idx" ON "Product"("isActive");
CREATE INDEX IF NOT EXISTS "Product_isFeatured_idx" ON "Product"("isFeatured");

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Shipment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;

-- Category: public read
CREATE POLICY "Category public read" ON "Category"
  FOR SELECT USING (true);

-- Product: public read
CREATE POLICY "Product public read" ON "Product"
  FOR SELECT USING (true);

-- Order: users can insert their own, read their own
CREATE POLICY "Order insert own" ON "Order"
  FOR INSERT WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Order select own" ON "Order"
  FOR SELECT USING (auth.uid()::text = "userId"::text);

-- OrderItem: users can insert/read items for their own orders
CREATE POLICY "OrderItem insert own" ON "OrderItem"
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM "Order" WHERE "Order"."id" = "orderId" AND "Order"."userId"::text = auth.uid()::text)
  );

CREATE POLICY "OrderItem select own" ON "OrderItem"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "Order" WHERE "Order"."id" = "orderId" AND "Order"."userId"::text = auth.uid()::text)
  );

-- Payment: users can insert/read for their own orders
CREATE POLICY "Payment insert own" ON "Payment"
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM "Order" WHERE "Order"."id" = "orderId" AND "Order"."userId"::text = auth.uid()::text)
  );

CREATE POLICY "Payment select own" ON "Payment"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "Order" WHERE "Order"."id" = "orderId" AND "Order"."userId"::text = auth.uid()::text)
  );

-- Shipment: users can read for their own orders
CREATE POLICY "Shipment select own" ON "Shipment"
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM "Order" WHERE "Order"."id" = "orderId" AND "Order"."userId"::text = auth.uid()::text)
  );

-- ============================================
-- STORAGE BUCKET
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-slips', 'payment-slips', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: authenticated users can upload
CREATE POLICY "Payment slip upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'payment-slips' AND auth.role() = 'authenticated'
  );

-- Storage policy: public read
CREATE POLICY "Payment slip public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'payment-slips');

-- ============================================
-- HELPER FUNCTION: deduct stock
-- ============================================

CREATE OR REPLACE FUNCTION deduct_stock(p_id TEXT, p_qty INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE "Product"
  SET "stockQty" = "stockQty" - p_qty,
      "inStock" = CASE WHEN "stockQty" - p_qty > 0 THEN true ELSE false END,
      "updatedAt" = now()
  WHERE "id" = p_id AND "stockQty" >= p_qty;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock for product %', p_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SEED DATA
-- ============================================

-- Seed categories
INSERT INTO "Category" ("id", "name", "icon") VALUES
  ('cat-1', 'Electronic Devices', 'Smartphone'),
  ('cat-2', 'Electronic Accessories', 'Headphones'),
  ('cat-3', 'TV & Home Appliances', 'Tv'),
  ('cat-4', 'Health & Beauty', 'Sparkles'),
  ('cat-5', 'Babies & Toys', 'Baby'),
  ('cat-6', 'Home & Living', 'Home')
ON CONFLICT ("id") DO NOTHING;

-- Seed products
INSERT INTO "Product" ("id", "name", "price", "originalPrice", "image", "images", "categoryId", "rating", "reviews", "description", "features", "inStock", "stockQty", "discount", "isNew", "isFeatured") VALUES
  ('prod-1', 'Wireless Headphones Pro', 89.99, 129.99,
   'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
   ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'],
   'cat-2', 4.5, 128, 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
   ARRAY['Active Noise Cancellation', '30hr Battery', 'Premium Drivers', 'Bluetooth 5.3'],
   true, 50, 30, true, true),

  ('prod-2', 'Smart Watch Ultra', 299.99, 399.99,
   'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
   ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'],
   'cat-1', 4.7, 256, 'Advanced smartwatch with health monitoring and GPS tracking.',
   ARRAY['Heart Rate Monitor', 'GPS', 'Water Resistant', '7-day Battery'],
   true, 30, 25, true, true),

  ('prod-3', 'Bluetooth Speaker', 49.99, 69.99,
   'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=400',
   ARRAY['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800'],
   'cat-2', 4.3, 89, 'Portable Bluetooth speaker with rich bass and waterproof design.',
   ARRAY['Waterproof IPX7', '12hr Playtime', 'Rich Bass', 'Portable'],
   true, 100, 28, false, true),

  ('prod-4', 'Mechanical Keyboard', 79.99, 99.99,
   'https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&q=80&w=400',
   ARRAY['https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&q=80&w=800'],
   'cat-2', 4.6, 167, 'RGB mechanical keyboard with hot-swappable switches.',
   ARRAY['Hot-swappable', 'RGB Backlight', 'PBT Keycaps', 'USB-C'],
   true, 75, 20, false, true),

  ('prod-5', 'USB-C Hub 7-in-1', 34.99, 49.99,
   'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&q=80&w=400',
   ARRAY['https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&q=80&w=800'],
   'cat-2', 4.4, 93, '7-in-1 USB-C hub with HDMI, USB-A, SD card reader.',
   ARRAY['4K HDMI', 'USB 3.0', 'SD Reader', '100W PD'],
   true, 120, 30, true, false),

  ('prod-6', 'Webcam HD 1080p', 39.99, 59.99,
   'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&q=80&w=400',
   ARRAY['https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&q=80&w=800'],
   'cat-1', 4.2, 74, 'Full HD webcam with built-in microphone and auto-focus.',
   ARRAY['1080p Full HD', 'Auto Focus', 'Built-in Mic', 'Wide Angle'],
   true, 60, 33, false, false),

  ('prod-7', 'Wireless Mouse', 24.99, 34.99,
   'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=400',
   ARRAY['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800'],
   'cat-2', 4.5, 203, 'Ergonomic wireless mouse with silent clicks.',
   ARRAY['Silent Click', 'Ergonomic', '1600 DPI', '18-month Battery'],
   true, 150, 28, false, false),

  ('prod-8', 'Laptop Stand Aluminum', 29.99, 44.99,
   'https://images.unsplash.com/photo-1527434999708-4b3f5269c47d?auto=format&fit=crop&q=80&w=400',
   ARRAY['https://images.unsplash.com/photo-1527434999708-4b3f5269c47d?auto=format&fit=crop&q=80&w=800'],
   'cat-2', 4.6, 145, 'Adjustable aluminum laptop stand for better ergonomics.',
   ARRAY['Aluminum', 'Adjustable', 'Foldable', 'Anti-slip'],
   true, 80, 33, false, false)
ON CONFLICT ("id") DO NOTHING;
