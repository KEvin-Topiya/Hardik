-- Complete Database Schema for Aarti Abhushan
-- PostgreSQL

-- Drop tables in correct order of dependency
DROP VIEW IF EXISTS product_sales_stats;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS whatsapp_clicks;
DROP TABLE IF EXISTS hero_images;
DROP TABLE IF EXISTS products;

-- 1. Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    category VARCHAR(100) NOT NULL,
    material VARCHAR(100) NOT NULL,
    description TEXT,
    weight VARCHAR(50),
    dimensions VARCHAR(100),
    finish VARCHAR(100),
    stone VARCHAR(100),
    images TEXT[], -- Array of image filenames/URLs
    is_new BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Hero Images (for Home Slideshow)
CREATE TABLE hero_images (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. WhatsApp Click Tracking (for Trending analysis)
CREATE TABLE whatsapp_clicks (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Orders Table (Optimized for WhatsApp Parsing)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    total_amount INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'delivered', 'canceled'
    raw_message TEXT, -- Original pasted WhatsApp message
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Order Items
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_purchase INTEGER NOT NULL
);

-- 6. Sales Stats View (for Trending)
CREATE VIEW product_sales_stats AS
SELECT 
    p.id as product_id,
    COUNT(wc.id) as sales_count
FROM products p
LEFT JOIN whatsapp_clicks wc ON p.id = wc.product_id
GROUP BY p.id;
