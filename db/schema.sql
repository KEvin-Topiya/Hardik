-- Schema for Meridian E-commerce (PostgreSQL)
-- Drop tables if they exist to allow clean re-run
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;


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
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    total_amount INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'canceled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_purchase INTEGER NOT NULL
);
