-- Check products table
SELECT * FROM products;

-- Check if there are any products
SELECT COUNT(*) FROM products;

-- Check the most recent products
SELECT * FROM products ORDER BY created_at DESC LIMIT 5; 