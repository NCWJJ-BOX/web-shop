-- WebShop Supabase Migration
-- Run this in Supabase SQL Editor

-- Create tables
CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "icon" TEXT NOT NULL DEFAULT '',
  "count" INTEGER NOT NULL DEFAULT 0,
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
  "stockQty" INTEGER NOT NULL DEFAULT 0,
  "discount" INTEGER,
  "isNew" BOOLEAN DEFAULT false,
  "isFeatured" BOOLEAN DEFAULT false,
  "isActive" BOOLEAN DEFAULT true,
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- Seed categories
INSERT INTO "Category" ("id", "name", "icon") VALUES
  ('cat-1', 'Electronic Devices', ''),
  ('cat-2', 'Electronic Accessories', ''),
  ('cat-3', 'TV & Home Appliances', ''),
  ('cat-4', 'Health & Beauty', ''),
  ('cat-5', 'Babies & Toys', ''),
  ('cat-6', 'Home & Living', '')
ON CONFLICT ("id") DO NOTHING;

-- Seed products
INSERT INTO "Product" ("id", "name", "price", "originalPrice", "image", "images", "categoryId", "rating", "reviews", "description", "features", "inStock", "stockQty", "discount", "isNew", "isFeatured") VALUES
  ('prod-1', 'Wireless Headphones Pro', 89.99, 129.99,
   'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
   ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'],
   'cat-1', 4.5, 128, 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
   ARRAY['Active Noise Cancellation', '30hr Battery', 'Bluetooth 5.3', 'USB-C Fast Charge'],
   true, 50, 30, true, true),

  ('prod-2', 'Smart Watch Series 7', 199.99, 299.99,
   'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
   ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'],
   'cat-1', 4.7, 256, 'Advanced smartwatch with health monitoring, GPS, and always-on display.',
   ARRAY['Heart Rate Monitor', 'GPS Tracking', 'Water Resistant 50m', 'Always-on Display'],
   true, 35, 33, true, true),

  ('prod-3', 'Mechanical Keyboard RGB', 149.99, 199.99,
   'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=400',
   ARRAY['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800'],
   'cat-2', 4.3, 89, 'Premium mechanical keyboard with customizable RGB lighting and hot-swappable switches.',
   ARRAY['Hot-swappable Switches', 'Per-key RGB', 'PBT Keycaps', 'USB-C'],
   true, 75, 25, false, true),

  ('prod-4', 'Ultra-Wide Monitor 34"', 599.99, 799.99,
   'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400',
   ARRAY['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800'],
   'cat-1', 4.6, 67, 'Immersive ultra-wide curved monitor with stunning WQHD resolution.',
   ARRAY['34" WQHD 3440x1440', '144Hz Refresh Rate', 'HDR400', 'USB-C Hub'],
   true, 20, 25, true, true),

  ('prod-5', 'Portable Bluetooth Speaker', 59.99, 89.99,
   'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=400',
   ARRAY['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800'],
   'cat-2', 4.2, 203, 'Compact waterproof speaker with 360° sound and 20-hour battery.',
   ARRAY['IPX7 Waterproof', '20hr Battery', '360° Sound', 'Party Mode'],
   true, 100, 33, false, true),

  ('prod-6', 'USB-C Hub 7-in-1', 45.99, 69.99,
   'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&q=80&w=400',
   ARRAY['https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&q=80&w=800'],
   'cat-2', 4.4, 156, 'Versatile USB-C hub with 7 ports for all your connectivity needs.',
   ARRAY['HDMI 4K@60Hz', 'USB 3.0 x2', 'SD Card Reader', '100W PD Pass-through'],
   true, 200, 34, true, true),

  ('prod-7', 'Wireless Charging Pad', 29.99, 49.99,
   'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400',
   ARRAY['https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800'],
   'cat-2', 4.1, 312, 'Fast wireless charging pad compatible with all Qi-enabled devices.',
   ARRAY['15W Fast Charge', 'Qi Compatible', 'LED Indicator', 'Anti-slip Surface'],
   true, 300, 40, false, true),

  ('prod-8', 'Laptop Stand Aluminum', 39.99, 59.99,
   'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=400',
   ARRAY['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800'],
   'cat-6', 4.5, 178, 'Ergonomic aluminum laptop stand with adjustable height and angle.',
   ARRAY['Adjustable Height', 'Cable Management', 'Anti-slip Pads', 'Foldable Design'],
   true, 150, 33, false, true)
ON CONFLICT ("id") DO NOTHING;

-- Enable RLS (allow public read for showcase)
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON "Category" FOR SELECT USING (true);
CREATE POLICY "Public read products" ON "Product" FOR SELECT USING (true);
