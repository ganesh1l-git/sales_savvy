export const DEFAULT_CATEGORIES = [
  { categoryId: 1, categoryName: "Fashion" },
  { categoryId: 2, categoryName: "Mobiles" },
  { categoryId: 3, categoryName: "Electronics" },
  { categoryId: 4, categoryName: "Beauty" },
  { categoryId: 5, categoryName: "Home" },
  { categoryId: 6, categoryName: "Appliances" },
  { categoryId: 7, categoryName: "Toys, baby" },
  { categoryId: 8, categoryName: "Food & Health" },
  { categoryId: 9, categoryName: "Auto Accessories" },
  { categoryId: 10, categoryName: "Sports & Fitness" },
  { categoryId: 11, categoryName: "Furniture" },
  { categoryId: 12, categoryName: "Books" },
  { categoryId: 13, categoryName: "2 Wheelers" }
];

export const DEFAULT_PRODUCTS = [
  // =========================================================================
  // TECHNOLOGY / ELECTRONICS
  // =========================================================================
  {
    productId: 1,
    productName: "Apple MacBook Air M2 (13.6-inch, 8GB RAM, 256GB SSD, Midnight)",
    description: "Apple M2 chip with 8-core CPU and 8-core GPU. 13.6-inch Liquid Retina display with True Tone. 8GB unified memory, 256GB superfast SSD storage. Backlit Magic Keyboard with Touch ID, 1080p FaceTime HD camera, MagSafe 3 charging port.",
    price: 89990.00,
    stockQuantity: 15,
    category: { categoryId: 3, categoryName: "Electronics" },
    subCategory: "Laptops",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 2,
    productName: "ASUS TUF Gaming A15 AMD Ryzen 7 7735HS Gaming Laptop",
    description: "15.6-inch FHD (1920 x 1080) 144Hz IPS-level anti-glare display. AMD Ryzen 7 7735HS Processor with NVIDIA GeForce RTX 3050 4GB GDDR6 graphics. 16GB DDR5 RAM, 512GB PCIe 4.0 NVMe SSD, RGB Backlit Keyboard, Windows 11 Home.",
    price: 69990.00,
    stockQuantity: 20,
    category: { categoryId: 3, categoryName: "Electronics" },
    subCategory: "Laptops",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 3,
    productName: "Lenovo IdeaPad Slim 3 12th Gen Intel Core i5 Thin & Light Laptop",
    description: "15.6-inch FHD Anti-Glare display (250 nits). Intel Core i5-12450H 12th Gen processor, 16GB LPDDR5 RAM, 512GB SSD. Arctic Grey, 1.62 kg, Dolby Audio stereo speakers, rapid charge technology.",
    price: 52990.00,
    stockQuantity: 25,
    category: { categoryId: 3, categoryName: "Electronics" },
    subCategory: "Laptops",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 4,
    productName: "Apple iPad 10th Gen (10.9-inch Liquid Retina, A14 Bionic, 64GB Wi-Fi)",
    description: "10.9-inch Liquid Retina display with True Tone. A14 Bionic chip with 6-core CPU and 4-core GPU. 12MP Wide back camera, landscape 12MP Ultra Wide front camera with Center Stage, Touch ID, USB-C connectivity.",
    price: 34900.00,
    stockQuantity: 30,
    category: { categoryId: 3, categoryName: "Electronics" },
    subCategory: "Tablets",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 5,
    productName: "Xiaomi Pad 6 (11-inch 2.8K 144Hz Display, Snapdragon 870, 8GB/256GB)",
    description: "Snapdragon 870 Octa-Core Processor, 8GB LPDDR5 RAM, 256GB UFS 3.1 storage. 11-inch 2.8K Crystal Clear display with 144Hz refresh rate, Dolby Vision Atmos, quad speakers, 8840mAh high capacity battery.",
    price: 24999.00,
    stockQuantity: 28,
    category: { categoryId: 3, categoryName: "Electronics" },
    subCategory: "Tablets",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 6,
    productName: "Philips OneBlade Face & Body Trimmer and Shaver QP2824",
    description: "Unique OneBlade dual protection technology with fast cutter (12000x per minute). Shave, trim, and edge any length of hair. Waterproof IPX7, 45 minutes runtime on single USB-A charge, includes skin guard and body comb.",
    price: 1899.00,
    stockQuantity: 40,
    category: { categoryId: 3, categoryName: "Electronics" },
    subCategory: "Grooming",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 7,
    productName: "Spigen Liquid Air Armor Back Cover for iPhone 15",
    description: "Modern geometric pattern with matte finish. Air Cushion Technology for anti-shock military drop protection. Raised bezels lift screen and camera off flat surfaces, wireless charging compatible.",
    price: 1299.00,
    stockQuantity: 60,
    category: { categoryId: 3, categoryName: "Electronics" },
    subCategory: "Mobile covers",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 8,
    productName: "Logitech MK295 Silent Wireless Keyboard and Mouse Combo",
    description: "SilentTouch technology removes over 90% of clicking and typing noise without losing click feel. Full-size keyboard with 8 handy shortcuts, 24-month keyboard and 18-month mouse battery life, lag-free 2.4GHz wireless.",
    price: 2295.00,
    stockQuantity: 45,
    category: { categoryId: 3, categoryName: "Electronics" },
    subCategory: "Accessories",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 9,
    productName: "Mi 20000mAh Power Bank 3i with 18W Fast Charging",
    description: "High-density Lithium Polymer battery with 18W fast charging output. Triple port output allows simultaneous charging of 3 devices. Dual input (Type-C and Micro-USB), 12-layer advanced circuit chip protection.",
    price: 2099.00,
    stockQuantity: 55,
    category: { categoryId: 3, categoryName: "Electronics" },
    subCategory: "Power Bank",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 10,
    productName: "Sony PlayStation 5 Console (Slim Disc Edition)",
    description: "PlayStation 5 Slim model with 1TB ultra-high speed SSD storage. Ray tracing support, 4K-TV gaming up to 120fps, HDR technology, Tempest 3D AudioTech, DualSense wireless controller with haptic feedback and adaptive triggers.",
    price: 54990.00,
    stockQuantity: 12,
    category: { categoryId: 3, categoryName: "Electronics" },
    subCategory: "Gaming",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 11,
    productName: "TP-Link Tapo C210 2K 3MP Pan/Tilt Smart Security Wi-Fi Camera",
    description: "Ultra-High-Definition 2K (3MP) video resolution. 360-degree horizontal and 114-degree vertical range. Advanced night vision up to 30 ft, motion detection and alerts, two-way audio, supports microSD card up to 256GB.",
    price: 2199.00,
    stockQuantity: 35,
    category: { categoryId: 3, categoryName: "Electronics" },
    subCategory: "Smart home Nav",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 12,
    productName: "TP-Link Archer AX12 Wi-Fi 6 Dual-Band Gigabit Router",
    description: "Next-gen Wi-Fi 6 speeds up to 1.5 Gbps (1201 Mbps on 5 GHz and 300 Mbps on 2.4 GHz band). OFDMA and MU-MIMO technology connects more devices simultaneously with reduced lag. 4 high-gain antennas with Beamforming.",
    price: 2999.00,
    stockQuantity: 40,
    category: { categoryId: 3, categoryName: "Electronics" },
    subCategory: "Networking",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 13,
    productName: "JBL Cinema SB271 2.1 Channel Soundbar with Wireless Subwoofer (220W)",
    description: "220 Watts powerful audio output with dedicated wireless subwoofer delivering deep bass. Dolby Digital embedded, HDMI ARC and Optical cable connectivity, Bluetooth 5.1 wireless streaming.",
    price: 12999.00,
    stockQuantity: 18,
    category: { categoryId: 3, categoryName: "Electronics" },
    subCategory: "Speakers",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 14,
    productName: "Sony WH-1000XM5 Wireless Industry Leading Noise Cancelling Headphones",
    description: "Two processors and 8 microphones for unprecedented active noise cancellation. Auto NC Optimizer, specially designed 30mm driver unit, crystal clear hands-free calling with 4 beamforming microphones, up to 30 hours battery life.",
    price: 29990.00,
    stockQuantity: 22,
    category: { categoryId: 3, categoryName: "Electronics" },
    subCategory: "Earphones",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 15,
    productName: "boAt Airdopes 141 Bluetooth Truly Wireless Earbuds",
    description: "Up to 42 hours of total playback time with 6 hours uninterrupted playtime per charge. 8mm drivers deliver boAt Signature Sound. BEAST Mode for real-time low latency gaming, ENx Environmental Noise Cancellation technology, IPX4 sweat proof.",
    price: 1299.00,
    stockQuantity: 75,
    category: { categoryId: 3, categoryName: "Electronics" },
    subCategory: "Earphones",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 16,
    productName: "Samsung Galaxy Watch 4 Bluetooth (44mm, Super AMOLED)",
    description: "Body Composition Analysis with Samsung BioActive Sensor. Comprehensive sleep tracker with blood oxygen level monitoring. Wear OS Powered by Samsung, 90+ workout tracking modes, optical heart rate sensor.",
    price: 9999.00,
    stockQuantity: 25,
    category: { categoryId: 3, categoryName: "Electronics" },
    subCategory: "Wearables",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 17,
    productName: "Noise ColorFit Pro 4 Alpha 1.78 inch AMOLED Calling Smartwatch",
    description: "1.78-inch AMOLED display with 368*448 high resolution and 500 nits brightness. Tru Sync Bluetooth calling technology, functional digital crown, 100 sports modes, Noise Health Suite with SpO2 and 24/7 heart rate monitor.",
    price: 2499.00,
    stockQuantity: 50,
    category: { categoryId: 3, categoryName: "Electronics" },
    subCategory: "Wearables",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 18,
    productName: "Logitech MX Master 3S Wireless Performance Ergonomic Mouse",
    description: "Quiet Clicks with 90% less noise. 8K DPI any-surface tracking, MagSpeed electromagnetic scrolling wheels capable of 1,000 lines per second. USB-C rechargeable, pairs up to 3 computers across Windows and macOS.",
    price: 8995.00,
    stockQuantity: 20,
    category: { categoryId: 3, categoryName: "Electronics" },
    subCategory: "ITPeripherals",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 19,
    productName: "Anker 67W GaN 3-Port Fast Charger (2 USB-C + 1 USB-A)",
    description: "GaNPrime intelligent power allocation technology. Fast charge MacBook Air, iPhone, and iPad simultaneously. 51% smaller than original 67W charger, ActiveShield 2.0 safety temperature monitoring system.",
    price: 3499.00,
    stockQuantity: 40,
    category: { categoryId: 3, categoryName: "Electronics" },
    subCategory: "Chargers & Cables",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 20,
    productName: "Apple iPhone 15 (128 GB) - Black",
    description: "Dynamic Island bubbles up alerts and Live Activities. 48MP Main camera with 2x Telephoto. Durable color-infused glass and aluminum design. A16 Bionic chip, USB-C charging with all-day battery life.",
    price: 69999.00,
    stockQuantity: 15,
    category: { categoryId: 2, categoryName: "Mobiles" },
    subCategory: "Tech drop",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 21,
    productName: "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)",
    description: "Galaxy AI features Circle to Search, Live Translate, and Photo Assist. 200MP camera system with 5x optical zoom, Snapdragon 8 Gen 3 for Galaxy, 6.8-inch Dynamic AMOLED 2X flat display with Corning Gorilla Armor.",
    price: 129999.00,
    stockQuantity: 10,
    category: { categoryId: 2, categoryName: "Mobiles" },
    subCategory: "Tech drop",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80" }]
  },

  // =========================================================================
  // FASHION
  // =========================================================================
  {
    productId: 22,
    productName: "Biba Women Cotton Straight Printed Kurta Set with Palazzo & Dupatta",
    description: "Pure cotton ethnic kurta set featuring intricate floral block print, round neck with notch, three-quarter sleeves, matched with straight cotton palazzos and a lightweight chiffon bordered dupatta.",
    price: 2499.00,
    stockQuantity: 40,
    category: { categoryId: 1, categoryName: "Fashion" },
    subCategory: "Kurta sets",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 23,
    productName: "Libas Women Ethnic Embroidered Rayon Anarkali Kurta Set",
    description: "Flared Anarkali kurta crafted from premium soft rayon with delicate zari work on the yoke, paired with comfortable churidar pants and gold-foiled dupatta. Ideal for festive gatherings and ceremonies.",
    price: 1799.00,
    stockQuantity: 35,
    category: { categoryId: 1, categoryName: "Fashion" },
    subCategory: "Kurta sets",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 24,
    productName: "Forever New Women Floral Print Tiered Fit & Flare Midi Dress",
    description: "Elegant pastel floral tiered midi dress with V-neckline, self-tie fabric waist belt, flutter short sleeves, and flowy silhouette lined with breathable viscose fabric.",
    price: 4400.00,
    stockQuantity: 20,
    category: { categoryId: 1, categoryName: "Fashion" },
    subCategory: "Dresses",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 25,
    productName: "Wildcraft 35L Water-Resistant Laptop Backpack with Rain Cover",
    description: "Three spacious zippered compartments with dedicated padded sleeve for up to 15.6-inch laptops. Ergonomic contoured shoulder straps with air mesh padding and integrated waterproof rain cover in bottom pouch.",
    price: 1699.00,
    stockQuantity: 50,
    category: { categoryId: 1, categoryName: "Fashion" },
    subCategory: "Backpacks",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 26,
    productName: "Zaveri Pearls Gold Plated Kundan & Green Beads Choker Necklace Set",
    description: "Traditional handcrafted Kundan bridal choker set embellished with faux emerald green beads and pearls, paired with matching drop earrings and maang tikka.",
    price: 899.00,
    stockQuantity: 30,
    category: { categoryId: 1, categoryName: "Fashion" },
    subCategory: "Jewellery",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 27,
    productName: "Titan Neo Analog Blue Dial Men's Leather Strap Watch",
    description: "Contemporary deep blue sunray dial with silver indices and date aperture at 3 o'clock. Sturdy stainless steel case with scratch-resistant mineral glass and genuine dark brown stitched leather strap.",
    price: 3495.00,
    stockQuantity: 35,
    category: { categoryId: 1, categoryName: "Fashion" },
    subCategory: "Watches",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 28,
    productName: "Puma Men Solid Regular Fit Windbreaker Zip-Front Hooded Jacket",
    description: "windCELL technology protects against wind chill while maintaining breathability. Full front zipper, elasticated storm cuffs and hem, two secure side zip pockets, lightweight packable design.",
    price: 2799.00,
    stockQuantity: 30,
    category: { categoryId: 1, categoryName: "Fashion" },
    subCategory: "Jackets",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 29,
    productName: "Jockey Men Super Combed Cotton Ribbed Briefs (Pack of 3)",
    description: "100% super combed cotton fabric with StayFresh antibacterial treatment. Soft microfiber elastic waistband prevents marks and chafing, full rear coverage for all-day comfort.",
    price: 599.00,
    stockQuantity: 80,
    category: { categoryId: 1, categoryName: "Fashion" },
    subCategory: "Briefs, vest",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 30,
    productName: "Metro Women Embellished Block Heel Ankle Strap Sandals",
    description: "2.5-inch sturdy block heels with metallic cross-strap upper accented with subtle rhinestone shimmer. Cushioned insole and anti-slip textured resin outsole.",
    price: 1990.00,
    stockQuantity: 25,
    category: { categoryId: 1, categoryName: "Fashion" },
    subCategory: "Heels & flats",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 31,
    productName: "Bata Men Brown Lightweight Daily Wear Casual Fisherman Sandals",
    description: "Synthetic leather straps with adjustable hook-and-loop velcro closure. Ergonomically molded footbed with arch support and flexible grooved TPR sole for superior grip.",
    price: 1299.00,
    stockQuantity: 45,
    category: { categoryId: 1, categoryName: "Fashion" },
    subCategory: "Sandals",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 32,
    productName: "Manyavar Men Royal Jacquard Silk Blend Kurta Pyjama Set",
    description: "Regal mandarin collar kurta woven with rich brocade jacquard self-pattern in maroon gold, complemented with comfortable ivory churidar pajama trousers.",
    price: 3999.00,
    stockQuantity: 20,
    category: { categoryId: 1, categoryName: "Fashion" },
    subCategory: "Kurta pyjama",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 33,
    productName: "Tokyo Talkies Women Korean Oversized Aesthetic Graphic Drop-Shoulder Tee",
    description: "Trendy Seoul streetwear boxy fit t-shirt crafted from heavy 220 GSM combed cotton. Ribbed crew neckline, drop shoulders, and retro typography print on back.",
    price: 799.00,
    stockQuantity: 60,
    category: { categoryId: 1, categoryName: "Fashion" },
    subCategory: "Korean Store",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 34,
    productName: "US Polo Assn. Men Solid Pique Pure Cotton Slim Fit Polo T-Shirt",
    description: "Classic two-button placket with signature embroidered brand logo on left chest. Breathable pique cotton weave with ribbed collar and sleeve cuffs.",
    price: 1499.00,
    stockQuantity: 55,
    category: { categoryId: 1, categoryName: "Fashion" },
    subCategory: "Shirts,tees",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 35,
    productName: "Flying Machine Men Multi-Pocket Relaxed Fit Cargo Trousers",
    description: "Durable cotton twill weave with utilitarian 6-pocket configuration. Relaxed thigh fit with tapered drawstring ankles, reinforced seams for rugged casual utility.",
    price: 1899.00,
    stockQuantity: 35,
    category: { categoryId: 1, categoryName: "Fashion" },
    subCategory: "Jeans, Cargo",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 36,
    productName: "Puma Unisex-Adult Smashic Low-Top Casual Leather Sneakers",
    description: "Clean court-inspired tennis silhouette with soft synthetic leather upper and iconic Puma Formstrip overlay. SoftFoam+ comfort sockliner and non-marking vulcanized rubber outsole.",
    price: 2499.00,
    stockQuantity: 40,
    category: { categoryId: 1, categoryName: "Fashion" },
    subCategory: "Casual shoes",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 37,
    productName: "Nike Air Monarch IV Men Training & Cross Walking Shoes",
    description: "Durable leather upper with supportive overlays and perforations for airflow. Full-length encapsulated Nike Air-Sole unit provides lightweight cushioning, durable solid rubber outsole.",
    price: 4795.00,
    stockQuantity: 25,
    category: { categoryId: 1, categoryName: "Fashion" },
    subCategory: "Sports shoes",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 38,
    productName: "Levi's Men's 511 Mid Rise Slim Fit Stretchable Denim Jeans",
    description: "Classic 5-pocket styling in medium indigo wash with whiskering details. Slim from hip to ankle with built-in stretch elastane for all-day mobility and shape retention.",
    price: 2399.00,
    stockQuantity: 50,
    category: { categoryId: 1, categoryName: "Fashion" },
    subCategory: "Jeans",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 39,
    productName: "American Tourister 79cm Polypropylene Hard-Sided 8-Wheel Trolley",
    description: "Impact-resistant polypropylene hard shell with textured scratch-resistant finish. Smooth dual 360-degree spinner wheels, integrated TSA 3-digit combination lock, expandable packing volume.",
    price: 4499.00,
    stockQuantity: 20,
    category: { categoryId: 1, categoryName: "Fashion" },
    subCategory: "Trolley bags",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 40,
    productName: "Ray-Ban Aviator Classic Polarized Metal Frame Sunglasses",
    description: "Iconic teardrop aviator gold metal frame with polarized G-15 crystal green lenses. 100% UV400 radiation protection, eliminates glare, adjustable clear silicone nose pads.",
    price: 7490.00,
    stockQuantity: 15,
    category: { categoryId: 1, categoryName: "Fashion" },
    subCategory: "Sunglasses",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80" }]
  },
  {
    productId: 41,
    productName: "Zara Inspired Women Wide-Leg High-Rise Denim Cargo Pants",
    description: "High-waisted wide-leg cut in washed light blue denim. Side utilitarian bellows cargo pockets with flap closures, belt loops, and clean raw hem.",
    price: 1999.00,
    stockQuantity: 35,
    category: { categoryId: 1, categoryName: "Fashion" },
    subCategory: "Jeans, Cargo",
    images: [{ imageUrl: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop&q=80" }]
  }
];
