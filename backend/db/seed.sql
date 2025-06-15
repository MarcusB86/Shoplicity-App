-- Create a test user
INSERT INTO users (email, password) VALUES
('test@example.com', '$2b$10$YourHashedPasswordHere');

-- Insert sample products
INSERT INTO products (seller_id, title, description, price, category, condition, image_url) VALUES
(1, 'iPhone 13 Pro', 'Latest iPhone model with amazing camera and performance', 999.99, 'Electronics', 'New', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-max-graphite-select?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1631652956000'),
(1, 'MacBook Pro M2', 'Powerful laptop with M2 chip, perfect for professionals', 1299.99, 'Electronics', 'New', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spacegray-select-202301?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1671304673202'),
(1, 'Nike Air Max', 'Classic running shoes with great comfort and style', 129.99, 'Clothing', 'New', 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5c1e3a90-b11b-4797-8729-7d0f9b9bd123/air-max-90-mens-shoes-6n3vKB.png'),
(1, 'Samsung 4K TV', '55-inch 4K Smart TV with amazing picture quality', 699.99, 'Electronics', 'New', 'https://images.samsung.com/is/image/samsung/p6pim/us/ua55cu7000gxzb/gallery/uhd-4k-tv-cu7000-ua55cu7000gxzb-537900803'),
(1, 'Leather Backpack', 'Handcrafted genuine leather backpack, perfect for daily use', 89.99, 'Clothing', 'New', 'https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_UY1000_.jpg'),
(1, 'Coffee Maker', 'Programmable coffee maker with thermal carafe', 79.99, 'Home & Garden', 'New', 'https://m.media-amazon.com/images/I/71YwqQwXQAL._AC_SL1500_.jpg'),
(1, 'Yoga Mat', 'Non-slip yoga mat with carrying strap', 29.99, 'Sports', 'New', 'https://m.media-amazon.com/images/I/71L5dP+6NIL._AC_SL1500_.jpg'),
(1, 'Harry Potter Collection', 'Complete set of Harry Potter books, hardcover edition', 149.99, 'Books', 'New', 'https://m.media-amazon.com/images/I/71UwSHSZRnS._AC_UF1000,1000_QL80_.jpg'),
(1, 'LEGO Star Wars Set', 'Collector''s edition Star Wars LEGO set', 89.99, 'Toys', 'New', 'https://m.media-amazon.com/images/I/91KzZWpgmyL._AC_SL1500_.jpg'),
(1, 'Wireless Earbuds', 'Noise-cancelling wireless earbuds with charging case', 159.99, 'Electronics', 'New', 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg'),
(1, 'Smart Watch', 'Fitness tracker and smartwatch with heart rate monitor', 199.99, 'Electronics', 'New', 'https://m.media-amazon.com/images/I/61L5QgPvgqL._AC_SL1500_.jpg'),
(1, 'Gaming Mouse', 'RGB gaming mouse with programmable buttons', 49.99, 'Electronics', 'New', 'https://m.media-amazon.com/images/I/61UxfXTUyvL._AC_SL1500_.jpg'),
(1, 'Desk Chair', 'Ergonomic office chair with lumbar support', 249.99, 'Home & Garden', 'New', 'https://m.media-amazon.com/images/I/61hJ40qZjjL._AC_SL1500_.jpg'),
(1, 'Blender', 'High-speed blender for smoothies and food processing', 89.99, 'Home & Garden', 'New', 'https://m.media-amazon.com/images/I/71F3spc7ZEL._AC_SL1500_.jpg'),
(1, 'Basketball', 'Official size and weight basketball', 24.99, 'Sports', 'New', 'https://m.media-amazon.com/images/I/61L5QgPvgqL._AC_SL1500_.jpg'); 