-- Migration to update orders table for WhatsApp parsing
ALTER TABLE orders RENAME COLUMN customer_email TO customer_phone;
ALTER TABLE orders ALTER COLUMN customer_phone DROP NOT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS raw_message TEXT;

-- Ensure whatsapp_clicks table exists
CREATE TABLE IF NOT EXISTS whatsapp_clicks (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ensure hero_images table exists
CREATE TABLE IF NOT EXISTS hero_images (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ensure is_new column exists in products
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[];
