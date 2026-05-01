-- Migration v4: Add address and improve order tracking
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_address TEXT;
-- The status column already exists, but ensure it has a good default
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending';
