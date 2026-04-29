ALTER TABLE products DROP COLUMN IF EXISTS image_url_2;
ALTER TABLE products DROP COLUMN IF EXISTS image_url_3;
ALTER TABLE products DROP COLUMN IF EXISTS image_url;
ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[];

UPDATE products SET images = ARRAY['https://images.unsplash.com/photo-1605100804763-247f66122eff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] WHERE category = 'Rings';
UPDATE products SET images = ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1535632787358-b89c7ebfe9f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1633511451553-90d291942717?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] WHERE category = 'Earrings';
UPDATE products SET images = ARRAY['https://images.unsplash.com/photo-1599643478514-4a42ba899539?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1599643477877-530e5562020f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] WHERE category = 'Necklaces';
UPDATE products SET images = ARRAY['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'] WHERE category = 'Bracelets';
