ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1605100804763-247f66122eff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' WHERE category = 'Rings';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' WHERE category = 'Earrings';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1599643478514-4a42ba899539?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' WHERE category = 'Necklaces';
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' WHERE category = 'Bracelets';
