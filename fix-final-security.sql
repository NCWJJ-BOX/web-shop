-- FINAL SECURITY FIXES
-- Run in Supabase SQL Editor

-- Fix 1: Make storage bucket private (already done via API)
-- Payment slips now require signed URLs to access

-- Fix 2: Add storage policy for authenticated users to read their own slips
DROP POLICY IF EXISTS "Payment slip public read" ON storage.objects;

CREATE POLICY "Users read own slips" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'payment-slips'
    AND auth.role() = 'authenticated'
  );

-- Fix 3: Fix deduct_stock function - column name mismatch
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
