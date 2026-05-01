-- Migration V2: Add is_new column and WhatsApp click tracking
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS whatsapp_clicks (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- View to simplify getting click counts per product
CREATE OR REPLACE VIEW product_sales_stats AS
SELECT 
    p.id as product_id,
    p.name,
    COUNT(wc.id) as total_clicks
FROM products p
LEFT JOIN whatsapp_clicks wc ON p.id = wc.product_id
GROUP BY p.id, p.name;
