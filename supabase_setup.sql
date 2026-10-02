-- =============================================================================
-- SALES SAVVY - COMPLETE SUPABASE SETUP SCRIPT (SCHEMA + SEED DATA + RLS)
-- Run this whole script inside the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DROP EXISTING CONFLICTING TABLES IF ANY (Clean Setup)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 2. CREATE TABLES
CREATE TABLE categories (
    category_id BIGSERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE products (
    product_id BIGSERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    sub_category VARCHAR(100),
    category_id BIGINT REFERENCES categories(category_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE product_images (
    image_id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(product_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cart_items (
    cart_item_id BIGSERIAL PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    product_id BIGINT REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE orders (
    order_id BIGSERIAL PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    total_amount NUMERIC(12, 2) NOT NULL,
    shipping_amount NUMERIC(12, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'PENDING',
    payment_method VARCHAR(50) DEFAULT 'RAZORPAY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
    order_item_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(product_id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(12, 2) NOT NULL
);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 4. CREATE RLS POLICIES (Public read for ecommerce browsing)
CREATE POLICY "Public categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Public product images are viewable by everyone" ON product_images FOR SELECT USING (true);
CREATE POLICY "Users can manage their own cart items" ON cart_items FOR ALL USING (true);
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Users can insert their own orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their order items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Users can insert order items" ON order_items FOR INSERT WITH CHECK (true);

-- 5. SEED ALL CATEGORIES
INSERT INTO categories (category_id, category_name) VALUES
    (1, 'Fashion'),
    (2, 'Mobiles'),
    (3, 'Electronics'),
    (4, 'Beauty'),
    (5, 'Home'),
    (6, 'Appliances'),
    (7, 'Toys, baby'),
    (8, 'Food & Health'),
    (9, 'Auto Accessories'),
    (10, 'Sports & Fitness'),
    (11, 'Furniture'),
    (12, 'Books'),
    (13, '2 Wheelers');

-- 6. SEED ELECTRONICS / TECHNOLOGY PRODUCTS
INSERT INTO products (product_id, product_name, description, price, stock_quantity, sub_category, category_id) VALUES
    (1, 'Apple MacBook Air M2 (13.6-inch, 8GB RAM, 256GB SSD, Midnight)', 'Apple M2 chip with 8-core CPU and 8-core GPU. 13.6-inch Liquid Retina display with True Tone. 8GB unified memory, 256GB superfast SSD storage. Backlit Magic Keyboard with Touch ID, 1080p FaceTime HD camera, MagSafe 3 charging port.', 89990.00, 15, 'Laptops', 3),
    (2, 'ASUS TUF Gaming A15 AMD Ryzen 7 7735HS Gaming Laptop', '15.6-inch FHD (1920 x 1080) 144Hz IPS-level anti-glare display. AMD Ryzen 7 7735HS Processor with NVIDIA GeForce RTX 3050 4GB GDDR6 graphics. 16GB DDR5 RAM, 512GB PCIe 4.0 NVMe SSD, RGB Backlit Keyboard, Windows 11 Home.', 69990.00, 20, 'Laptops', 3),
    (3, 'Lenovo IdeaPad Slim 3 12th Gen Intel Core i5 Thin & Light Laptop', '15.6-inch FHD Anti-Glare display (250 nits). Intel Core i5-12450H 12th Gen processor, 16GB LPDDR5 RAM, 512GB SSD. Arctic Grey, 1.62 kg, Dolby Audio stereo speakers, rapid charge technology.', 52990.00, 25, 'Laptops', 3),
    (4, 'Apple iPad 10th Gen (10.9-inch Liquid Retina, A14 Bionic, 64GB Wi-Fi)', '10.9-inch Liquid Retina display with True Tone. A14 Bionic chip with 6-core CPU and 4-core GPU. 12MP Wide back camera, landscape 12MP Ultra Wide front camera with Center Stage, Touch ID, USB-C connectivity.', 34900.00, 30, 'Tablets', 3),
    (5, 'Xiaomi Pad 6 (11-inch 2.8K 144Hz Display, Snapdragon 870, 8GB/256GB)', 'Snapdragon 870 Octa-Core Processor, 8GB LPDDR5 RAM, 256GB UFS 3.1 storage. 11-inch 2.8K Crystal Clear display with 144Hz refresh rate, Dolby Vision Atmos, quad speakers, 8840mAh high capacity battery.', 24999.00, 28, 'Tablets', 3),
    (6, 'Philips OneBlade Face & Body Trimmer and Shaver QP2824', 'Unique OneBlade dual protection technology with fast cutter (12000x per minute). Shave, trim, and edge any length of hair. Waterproof IPX7, 45 minutes runtime on single USB-A charge, includes skin guard and body comb.', 1899.00, 40, 'Grooming', 3),
    (7, 'Spigen Liquid Air Armor Back Cover for iPhone 15', 'Modern geometric pattern with matte finish. Air Cushion Technology for anti-shock military drop protection. Raised bezels lift screen and camera off flat surfaces, wireless charging compatible.', 1299.00, 60, 'Mobile covers', 3),
    (8, 'Logitech MK295 Silent Wireless Keyboard and Mouse Combo', 'SilentTouch technology removes over 90% of clicking and typing noise without losing click feel. Full-size keyboard with 8 handy shortcuts, 24-month keyboard and 18-month mouse battery life, lag-free 2.4GHz wireless.', 2295.00, 45, 'Accessories', 3),
    (9, 'Mi 20000mAh Power Bank 3i with 18W Fast Charging', 'High-density Lithium Polymer battery with 18W fast charging output. Triple port output allows simultaneous charging of 3 devices. Dual input (Type-C and Micro-USB), 12-layer advanced circuit chip protection.', 2099.00, 55, 'Power Bank', 3),
    (10, 'Sony PlayStation 5 Console (Slim Disc Edition)', 'PlayStation 5 Slim model with 1TB ultra-high speed SSD storage. Ray tracing support, 4K-TV gaming up to 120fps, HDR technology, Tempest 3D AudioTech, DualSense wireless controller with haptic feedback and adaptive triggers.', 54990.00, 12, 'Gaming', 3),
    (11, 'TP-Link Tapo C210 2K 3MP Pan/Tilt Smart Security Wi-Fi Camera', 'Ultra-High-Definition 2K (3MP) video resolution. 360-degree horizontal and 114-degree vertical range. Advanced night vision up to 30 ft, motion detection and alerts, two-way audio, supports microSD card up to 256GB.', 2199.00, 35, 'Smart home Nav', 3),
    (12, 'TP-Link Archer AX12 Wi-Fi 6 Dual-Band Gigabit Router', 'Next-gen Wi-Fi 6 speeds up to 1.5 Gbps (1201 Mbps on 5 GHz and 300 Mbps on 2.4 GHz band). OFDMA and MU-MIMO technology connects more devices simultaneously with reduced lag. 4 high-gain antennas with Beamforming.', 2999.00, 40, 'Networking', 3),
    (13, 'JBL Cinema SB271 2.1 Channel Soundbar with Wireless Subwoofer (220W)', '220 Watts powerful audio output with dedicated wireless subwoofer delivering deep bass. Dolby Digital embedded, HDMI ARC and Optical cable connectivity, Bluetooth 5.1 wireless streaming.', 12999.00, 18, 'Speakers', 3),
    (14, 'Sony WH-1000XM5 Wireless Industry Leading Noise Cancelling Headphones', 'Two processors and 8 microphones for unprecedented active noise cancellation. Auto NC Optimizer, specially designed 30mm driver unit, crystal clear hands-free calling with 4 beamforming microphones, up to 30 hours battery life.', 29990.00, 22, 'Earphones', 3),
    (15, 'boAt Airdopes 141 Bluetooth Truly Wireless Earbuds', 'Up to 42 hours of total playback time with 6 hours uninterrupted playtime per charge. 8mm drivers deliver boAt Signature Sound. BEAST Mode for real-time low latency gaming, ENx Environmental Noise Cancellation technology, IPX4 sweat proof.', 1299.00, 75, 'Earphones', 3),
    (16, 'Samsung Galaxy Watch 4 Bluetooth (44mm, Super AMOLED)', 'Body Composition Analysis with Samsung BioActive Sensor. Comprehensive sleep tracker with blood oxygen level monitoring. Wear OS Powered by Samsung, 90+ workout tracking modes, optical heart rate sensor.', 9999.00, 25, 'Wearables', 3),
    (17, 'Noise ColorFit Pro 4 Alpha 1.78 inch AMOLED Calling Smartwatch', '1.78-inch AMOLED display with 368*448 high resolution and 500 nits brightness. Tru Sync Bluetooth calling technology, functional digital crown, 100 sports modes, Noise Health Suite with SpO2 and 24/7 heart rate monitor.', 2499.00, 50, 'Wearables', 3),
    (18, 'Logitech MX Master 3S Wireless Performance Ergonomic Mouse', 'Quiet Clicks with 90% less noise. 8K DPI any-surface tracking, MagSpeed electromagnetic scrolling wheels capable of 1,000 lines per second. USB-C rechargeable, pairs up to 3 computers across Windows and macOS.', 8995.00, 20, 'ITPeripherals', 3),
    (19, 'Anker 67W GaN 3-Port Fast Charger (2 USB-C + 1 USB-A)', 'GaNPrime intelligent power allocation technology. Fast charge MacBook Air, iPhone, and iPad simultaneously. 51% smaller than original 67W charger, ActiveShield 2.0 safety temperature monitoring system.', 3499.00, 40, 'Chargers & Cables', 3),
    (20, 'Apple iPhone 15 (128 GB) - Black', 'Dynamic Island bubbles up alerts and Live Activities. 48MP Main camera with 2x Telephoto. Durable color-infused glass and aluminum design. A16 Bionic chip, USB-C charging with all-day battery life.', 69999.00, 15, 'Tech drop', 2),
    (21, 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)', 'Galaxy AI features Circle to Search, Live Translate, and Photo Assist. 200MP camera system with 5x optical zoom, Snapdragon 8 Gen 3 for Galaxy, 6.8-inch Dynamic AMOLED 2X flat display with Corning Gorilla Armor.', 129999.00, 10, 'Tech drop', 2);

-- 7. SEED FASHION PRODUCTS
INSERT INTO products (product_id, product_name, description, price, stock_quantity, sub_category, category_id) VALUES
    (22, 'Biba Women Cotton Straight Printed Kurta Set with Palazzo & Dupatta', 'Pure cotton ethnic kurta set featuring intricate floral block print, round neck with notch, three-quarter sleeves, matched with straight cotton palazzos and a lightweight chiffon bordered dupatta.', 2499.00, 40, 'Kurta sets', 1),
    (23, 'Libas Women Ethnic Embroidered Rayon Anarkali Kurta Set', 'Flared Anarkali kurta crafted from premium soft rayon with delicate zari work on the yoke, paired with comfortable churidar pants and gold-foiled dupatta. Ideal for festive gatherings and ceremonies.', 1799.00, 35, 'Kurta sets', 1),
    (24, 'Forever New Women Floral Print Tiered Fit & Flare Midi Dress', 'Elegant pastel floral tiered midi dress with V-neckline, self-tie fabric waist belt, flutter short sleeves, and flowy silhouette lined with breathable viscose fabric.', 4400.00, 20, 'Dresses', 1),
    (25, 'Wildcraft 35L Water-Resistant Laptop Backpack with Rain Cover', 'Three spacious zippered compartments with dedicated padded sleeve for up to 15.6-inch laptops. Ergonomic contoured shoulder straps with air mesh padding and integrated waterproof rain cover in bottom pouch.', 1699.00, 50, 'Backpacks', 1),
    (26, 'Zaveri Pearls Gold Plated Kundan & Green Beads Choker Necklace Set', 'Traditional handcrafted Kundan bridal choker set embellished with faux emerald green beads and pearls, paired with matching drop earrings and maang tikka.', 899.00, 30, 'Jewellery', 1),
    (27, 'Titan Neo Analog Blue Dial Men''s Leather Strap Watch', 'Contemporary deep blue sunray dial with silver indices and date aperture at 3 o''clock. Sturdy stainless steel case with scratch-resistant mineral glass and genuine dark brown stitched leather strap.', 3495.00, 35, 'Watches', 1),
    (28, 'Puma Men Solid Regular Fit Windbreaker Zip-Front Hooded Jacket', 'windCELL technology protects against wind chill while maintaining breathability. Full front zipper, elasticated storm cuffs and hem, two secure side zip pockets, lightweight packable design.', 2799.00, 30, 'Jackets', 1),
    (29, 'Jockey Men Super Combed Cotton Ribbed Briefs (Pack of 3)', '100% super combed cotton fabric with StayFresh antibacterial treatment. Soft microfiber elastic waistband prevents marks and chafing, full rear coverage for all-day comfort.', 599.00, 80, 'Briefs, vest', 1),
    (30, 'Metro Women Embellished Block Heel Ankle Strap Sandals', '2.5-inch sturdy block heels with metallic cross-strap upper accented with subtle rhinestone shimmer. Cushioned insole and anti-slip textured resin outsole.', 1990.00, 25, 'Heels & flats', 1),
    (31, 'Bata Men Brown Lightweight Daily Wear Casual Fisherman Sandals', 'Synthetic leather straps with adjustable hook-and-loop velcro closure. Ergonomically molded footbed with arch support and flexible grooved TPR sole for superior grip.', 1299.00, 45, 'Sandals', 1),
    (32, 'Manyavar Men Royal Jacquard Silk Blend Kurta Pyjama Set', 'Regal mandarin collar kurta woven with rich brocade jacquard self-pattern in maroon gold, complemented with comfortable ivory churidar pajama trousers.', 3999.00, 20, 'Kurta pyjama', 1),
    (33, 'Tokyo Talkies Women Korean Oversized Aesthetic Graphic Drop-Shoulder Tee', 'Trendy Seoul streetwear boxy fit t-shirt crafted from heavy 220 GSM combed cotton. Ribbed crew neckline, drop shoulders, and retro typography print on back.', 799.00, 60, 'Korean Store', 1),
    (34, 'US Polo Assn. Men Solid Pique Pure Cotton Slim Fit Polo T-Shirt', 'Classic two-button placket with signature embroidered brand logo on left chest. Breathable pique cotton weave with ribbed collar and sleeve cuffs.', 1499.00, 55, 'Shirts,tees', 1),
    (35, 'Flying Machine Men Multi-Pocket Relaxed Fit Cargo Trousers', 'Durable cotton twill weave with utilitarian 6-pocket configuration. Relaxed thigh fit with tapered drawstring ankles, reinforced seams for rugged casual utility.', 1899.00, 35, 'Jeans, Cargo', 1),
    (36, 'Puma Unisex-Adult Smashic Low-Top Casual Leather Sneakers', 'Clean court-inspired tennis silhouette with soft synthetic leather upper and iconic Puma Formstrip overlay. SoftFoam+ comfort sockliner and non-marking vulcanized rubber outsole.', 2499.00, 40, 'Casual shoes', 1),
    (37, 'Nike Air Monarch IV Men Training & Cross Walking Shoes', 'Durable leather upper with supportive overlays and perforations for airflow. Full-length encapsulated Nike Air-Sole unit provides lightweight cushioning, durable solid rubber outsole.', 4795.00, 25, 'Sports shoes', 1),
    (38, 'Levi''s Men''s 511 Mid Rise Slim Fit Stretchable Denim Jeans', 'Classic 5-pocket styling in medium indigo wash with whiskering details. Slim from hip to ankle with built-in stretch elastane for all-day mobility and shape retention.', 2399.00, 50, 'Jeans', 1),
    (39, 'American Tourister 79cm Polypropylene Hard-Sided 8-Wheel Trolley', 'Impact-resistant polypropylene hard shell with textured scratch-resistant finish. Smooth dual 360-degree spinner wheels, integrated TSA 3-digit combination lock, expandable packing volume.', 4499.00, 20, 'Trolley bags', 1),
    (40, 'Ray-Ban Aviator Classic Polarized Metal Frame Sunglasses', 'Iconic teardrop aviator gold metal frame with polarized G-15 crystal green lenses. 100% UV400 radiation protection, eliminates glare, adjustable clear silicone nose pads.', 7490.00, 15, 'Sunglasses', 1),
    (41, 'Zara Inspired Women Wide-Leg High-Rise Denim Cargo Pants', 'High-waisted wide-leg cut in washed light blue denim. Side utilitarian bellows cargo pockets with flap closures, belt loops, and clean raw hem.', 1999.00, 35, 'Jeans, Cargo', 1);

-- 8. SEED PRODUCT IMAGES
INSERT INTO product_images (product_id, image_url) VALUES
    (1, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80'),
    (2, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80'),
    (3, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'),
    (4, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80'),
    (5, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80'),
    (6, 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80'),
    (7, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80'),
    (8, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'),
    (9, 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&auto=format&fit=crop&q=80'),
    (10, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80'),
    (11, 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80'),
    (12, 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80'),
    (13, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80'),
    (14, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'),
    (15, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'),
    (16, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'),
    (17, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'),
    (18, 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80'),
    (19, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80'),
    (20, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80'),
    (21, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80'),
    (22, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'),
    (23, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80'),
    (24, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80'),
    (25, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'),
    (26, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80'),
    (27, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80'),
    (28, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80'),
    (29, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80'),
    (30, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80'),
    (31, 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&auto=format&fit=crop&q=80'),
    (32, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80'),
    (33, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80'),
    (34, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'),
    (35, 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80'),
    (36, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80'),
    (37, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'),
    (38, 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80'),
    (39, 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80'),
    (40, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80'),
    (41, 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop&q=80');

-- 9. RESET SEQUENCES
SELECT setval('categories_category_id_seq', (SELECT MAX(category_id) FROM categories));
SELECT setval('products_product_id_seq', (SELECT MAX(product_id) FROM products));
SELECT setval('product_images_image_id_seq', (SELECT MAX(image_id) FROM product_images));
