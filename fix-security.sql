-- SECURITY FIX: Use app_metadata instead of user_metadata for role checks
-- app_metadata can ONLY be modified by service_role key, not by users themselves
-- Run this in Supabase SQL Editor

-- Drop ALL existing admin policies
DROP POLICY IF EXISTS "Admin can read all orders" ON "Order";
DROP POLICY IF EXISTS "Admin can update all orders" ON "Order";
DROP POLICY IF EXISTS "Admin can read all order items" ON "OrderItem";
DROP POLICY IF EXISTS "Admin can read all payments" ON "Payment";
DROP POLICY IF EXISTS "Admin can update all payments" ON "Payment";
DROP POLICY IF EXISTS "Admin can read all shipments" ON "Shipment";
DROP POLICY IF EXISTS "Admin can insert shipments" ON "Shipment";
DROP POLICY IF EXISTS "Admin can update shipments" ON "Shipment";
DROP POLICY IF EXISTS "Admin can insert categories" ON "Category";
DROP POLICY IF EXISTS "Admin can update categories" ON "Category";
DROP POLICY IF EXISTS "Admin can delete categories" ON "Category";
DROP POLICY IF EXISTS "Admin can insert products" ON "Product";
DROP POLICY IF EXISTS "Admin can update products" ON "Product";
DROP POLICY IF EXISTS "Admin can delete products" ON "Product";

-- Recreate with app_metadata check
CREATE POLICY "Admin read orders" ON "Order" FOR SELECT USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN');
CREATE POLICY "Admin update orders" ON "Order" FOR UPDATE USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN');
CREATE POLICY "Admin read order items" ON "OrderItem" FOR SELECT USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN');
CREATE POLICY "Admin read payments" ON "Payment" FOR SELECT USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN');
CREATE POLICY "Admin update payments" ON "Payment" FOR UPDATE USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN');
CREATE POLICY "Admin read shipments" ON "Shipment" FOR SELECT USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN');
CREATE POLICY "Admin insert shipments" ON "Shipment" FOR INSERT WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN');
CREATE POLICY "Admin update shipments" ON "Shipment" FOR UPDATE USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN');
CREATE POLICY "Admin insert categories" ON "Category" FOR INSERT WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN');
CREATE POLICY "Admin update categories" ON "Category" FOR UPDATE USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN');
CREATE POLICY "Admin delete categories" ON "Category" FOR DELETE USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN');
CREATE POLICY "Admin insert products" ON "Product" FOR INSERT WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN');
CREATE POLICY "Admin update products" ON "Product" FOR UPDATE USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN');
CREATE POLICY "Admin delete products" ON "Product" FOR DELETE USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'ADMIN');

-- Restore deleted product
INSERT INTO "Product" ("id", "name", "price", "originalPrice", "image", "images", "categoryId", "rating", "reviews", "description", "features", "inStock", "stockQty", "discount", "isNew", "isFeatured")
VALUES ('prod-6', 'Webcam HD 1080p', 39.99, 59.99,
  'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&q=80&w=400',
  ARRAY['https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&q=80&w=800'],
  'cat-1', 4.2, 74, 'Full HD webcam with built-in microphone and auto-focus.',
  ARRAY['1080p Full HD', 'Auto Focus', 'Built-in Mic', 'Wide Angle'],
  true, 60, 33, false, false)
ON CONFLICT ("id") DO NOTHING;

-- Restrict storage uploads to image files only
DROP POLICY IF EXISTS "Payment slip upload" ON storage.objects;
CREATE POLICY "Payment slip upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'payment-slips'
    AND auth.role() = 'authenticated'
    AND (storage.extension(name) IN ('jpg', 'jpeg', 'png', 'gif', 'webp'))
  );
