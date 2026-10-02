package com.sales.savvy.service;

import com.sales.savvy.entity.*;
import com.sales.savvy.repository.CategoryRepository;
import com.sales.savvy.repository.ProductRepository;
import com.sales.savvy.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedCategoriesAndProducts();
    }

    private void seedUsers() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                    "admin",
                    "admin@salessavvy.com",
                    passwordEncoder.encode("Admin@123"),
                    Role.ADMIN
            );
            admin.setStatus(UserStatus.ACTIVE);
            userRepository.save(admin);
            log.info("Default ADMIN user seeded: admin / Admin@123");
        }

        if (!userRepository.existsByUsername("aka")) {
            User customer = new User(
                    "aka",
                    "aka@example.com",
                    passwordEncoder.encode("aka123@123"),
                    Role.CUSTOMER
            );
            customer.setStatus(UserStatus.ACTIVE);
            userRepository.save(customer);
            log.info("Default CUSTOMER user seeded: aka / aka123@123");
        }
    }

    private Category getOrCreateCategory(String name) {
        return categoryRepository.findByCategoryName(name)
                .orElseGet(() -> categoryRepository.save(new Category(name)));
    }

    private void seedCategoriesAndProducts() {
        // Ensure all categories from the Category Header (Image 1) exist
        Category fashion = getOrCreateCategory("Fashion");
        Category mobiles = getOrCreateCategory("Mobiles");
        Category electronics = getOrCreateCategory("Electronics");
        Category beauty = getOrCreateCategory("Beauty");
        Category home = getOrCreateCategory("Home");
        Category appliances = getOrCreateCategory("Appliances");
        Category toysBaby = getOrCreateCategory("Toys, baby");
        Category foodHealth = getOrCreateCategory("Food & Health");
        Category autoAcc = getOrCreateCategory("Auto Accessories");
        Category sportsFitness = getOrCreateCategory("Sports & Fitness");
        Category furniture = getOrCreateCategory("Furniture");
        Category books = getOrCreateCategory("Books");
        Category twoWheelers = getOrCreateCategory("2 Wheelers");

        // If product count is below 40, seed genuine products for Fashion & Electronics
        if (productRepository.count() < 40) {
            log.info("Populating genuine products from Flipkart/Amazon for Fashion & Technology...");
            List<Product> productsToSave = new ArrayList<>();

            // =========================================================================
            // SECTION 1: TECHNOLOGY / ELECTRONICS (25 Genuine Products)
            // =========================================================================
            productsToSave.add(createProd(
                    "Apple MacBook Air M2 (13.6-inch, 8GB RAM, 256GB SSD, Midnight)",
                    "Apple M2 chip with 8-core CPU and 8-core GPU. 13.6-inch Liquid Retina display with True Tone. 8GB unified memory, 256GB superfast SSD storage. Backlit Magic Keyboard with Touch ID, 1080p FaceTime HD camera, MagSafe 3 charging port.",
                    new BigDecimal("89990.00"), 15, electronics, "Laptops",
                    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "ASUS TUF Gaming A15 AMD Ryzen 7 7735HS Gaming Laptop",
                    "15.6-inch FHD (1920 x 1080) 144Hz IPS-level anti-glare display. AMD Ryzen 7 7735HS Processor with NVIDIA GeForce RTX 3050 4GB GDDR6 graphics. 16GB DDR5 RAM, 512GB PCIe 4.0 NVMe SSD, RGB Backlit Keyboard, Windows 11 Home.",
                    new BigDecimal("69990.00"), 20, electronics, "Laptops",
                    "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Lenovo IdeaPad Slim 3 12th Gen Intel Core i5 Thin & Light Laptop",
                    "15.6-inch FHD Anti-Glare display (250 nits). Intel Core i5-12450H 12th Gen processor, 16GB LPDDR5 RAM, 512GB SSD. Arctic Grey, 1.62 kg, Dolby Audio stereo speakers, rapid charge technology.",
                    new BigDecimal("52990.00"), 25, electronics, "Laptops",
                    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Apple iPad 10th Gen (10.9-inch Liquid Retina, A14 Bionic, 64GB Wi-Fi)",
                    "10.9-inch Liquid Retina display with True Tone. A14 Bionic chip with 6-core CPU and 4-core GPU. 12MP Wide back camera, landscape 12MP Ultra Wide front camera with Center Stage, Touch ID, USB-C connectivity.",
                    new BigDecimal("34900.00"), 30, electronics, "Tablets",
                    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Xiaomi Pad 6 (11-inch 2.8K 144Hz Display, Snapdragon 870, 8GB/256GB)",
                    "Snapdragon 870 Octa-Core Processor, 8GB LPDDR5 RAM, 256GB UFS 3.1 storage. 11-inch 2.8K Crystal Clear display with 144Hz refresh rate, Dolby Vision Atmos, quad speakers, 8840mAh high capacity battery.",
                    new BigDecimal("24999.00"), 28, electronics, "Tablets",
                    "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Philips OneBlade Face & Body Trimmer and Shaver QP2824",
                    "Unique OneBlade dual protection technology with fast cutter (12000x per minute). Shave, trim, and edge any length of hair. Waterproof IPX7, 45 minutes runtime on single USB-A charge, includes skin guard and body comb.",
                    new BigDecimal("1899.00"), 40, electronics, "Grooming",
                    "https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Spigen Liquid Air Armor Back Cover for iPhone 15",
                    "Modern geometric pattern with matte finish. Air Cushion Technology for anti-shock military drop protection. Raised bezels lift screen and camera off flat surfaces, wireless charging compatible.",
                    new BigDecimal("1299.00"), 60, electronics, "Mobile covers",
                    "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Logitech MK295 Silent Wireless Keyboard and Mouse Combo",
                    "SilentTouch technology removes over 90% of clicking and typing noise without losing click feel. Full-size keyboard with 8 handy shortcuts, 24-month keyboard and 18-month mouse battery life, lag-free 2.4GHz wireless.",
                    new BigDecimal("2295.00"), 45, electronics, "Accessories",
                    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Mi 20000mAh Power Bank 3i with 18W Fast Charging",
                    "High-density Lithium Polymer battery with 18W fast charging output. Triple port output allows simultaneous charging of 3 devices. Dual input (Type-C and Micro-USB), 12-layer advanced circuit chip protection.",
                    new BigDecimal("2099.00"), 55, electronics, "Power Bank",
                    "https://images.unsplash.com/photo-1609592424109-dd9892f1b177?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Sony PlayStation 5 Console (Slim Disc Edition)",
                    "PlayStation 5 Slim model with 1TB ultra-high speed SSD storage. Ray tracing support, 4K-TV gaming up to 120fps, HDR technology, Tempest 3D AudioTech, DualSense wireless controller with haptic feedback and adaptive triggers.",
                    new BigDecimal("54990.00"), 12, electronics, "Gaming",
                    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "TP-Link Tapo C210 2K 3MP Pan/Tilt Smart Security Wi-Fi Camera",
                    "Ultra-High-Definition 2K (3MP) video resolution. 360-degree horizontal and 114-degree vertical range. Advanced night vision up to 30 ft, motion detection and alerts, two-way audio, supports microSD card up to 256GB.",
                    new BigDecimal("2199.00"), 35, electronics, "Smart home Nav",
                    "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "TP-Link Archer AX12 Wi-Fi 6 Dual-Band Gigabit Router",
                    "Next-gen Wi-Fi 6 speeds up to 1.5 Gbps (1201 Mbps on 5 GHz and 300 Mbps on 2.4 GHz band). OFDMA and MU-MIMO technology connects more devices simultaneously with reduced lag. 4 high-gain antennas with Beamforming.",
                    new BigDecimal("2999.00"), 40, electronics, "Networking",
                    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "JBL Cinema SB271 2.1 Channel Soundbar with Wireless Subwoofer (220W)",
                    "220 Watts powerful audio output with dedicated wireless subwoofer delivering deep bass. Dolby Digital embedded, HDMI ARC and Optical cable connectivity, Bluetooth 5.1 wireless streaming.",
                    new BigDecimal("12999.00"), 18, electronics, "Speakers",
                    "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Sony WH-1000XM5 Wireless Industry Leading Noise Cancelling Headphones",
                    "Two processors and 8 microphones for unprecedented active noise cancellation. Auto NC Optimizer, specially designed 30mm driver unit, crystal clear hands-free calling with 4 beamforming microphones, up to 30 hours battery life.",
                    new BigDecimal("29990.00"), 22, electronics, "Earphones",
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "boAt Airdopes 141 Bluetooth Truly Wireless Earbuds",
                    "Up to 42 hours of total playback time with 6 hours uninterrupted playtime per charge. 8mm drivers deliver boAt Signature Sound. BEAST Mode for real-time low latency gaming, ENx Environmental Noise Cancellation technology, IPX4 sweat proof.",
                    new BigDecimal("1299.00"), 75, electronics, "Earphones",
                    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Samsung Galaxy Watch 4 Bluetooth (44mm, Super AMOLED)",
                    "Body Composition Analysis with Samsung BioActive Sensor. Comprehensive sleep tracker with blood oxygen level monitoring. Wear OS Powered by Samsung, 90+ workout tracking modes, optical heart rate sensor.",
                    new BigDecimal("9999.00"), 25, electronics, "Wearables",
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Noise ColorFit Pro 4 Alpha 1.78 inch AMOLED Calling Smartwatch",
                    "1.78-inch AMOLED display with 368*448 high resolution and 500 nits brightness. Tru Sync Bluetooth calling technology, functional digital crown, 100 sports modes, Noise Health Suite with SpO2 and 24/7 heart rate monitor.",
                    new BigDecimal("2499.00"), 50, electronics, "Wearables",
                    "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Ola S1 X Electric Scooter (2 kWh Battery, 95 km Range)",
                    "Eco-friendly electric mobility with 6 kW peak motor power. 85 km/h top speed, 3 riding modes (Eco, Normal, Sports), 3.5-inch LCD display, physical key unlock, combined braking system.",
                    new BigDecimal("74999.00"), 8, electronics, "2 Wheelers",
                    "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Logitech MX Master 3S Wireless Performance Ergonomic Mouse",
                    "Quiet Clicks with 90% less noise. 8K DPI any-surface tracking, MagSpeed electromagnetic scrolling wheels capable of 1,000 lines per second. USB-C rechargeable, pairs up to 3 computers across Windows and macOS.",
                    new BigDecimal("8995.00"), 20, electronics, "ITPeripherals",
                    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Anker 67W GaN 3-Port Fast Charger (2 USB-C + 1 USB-A)",
                    "GaNPrime intelligent power allocation technology. Fast charge MacBook Air, iPhone, and iPad simultaneously. 51% smaller than original 67W charger, ActiveShield 2.0 safety temperature monitoring system.",
                    new BigDecimal("3499.00"), 40, electronics, "Chargers & Cables",
                    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Insta360 X3 Waterproof 360 Action Camera 5.7K 360 Video",
                    "Dual 1/2-inch 48MP sensors capture 5.7K 360-degree Active HDR video and 72MP 360 photos. Invisible selfie stick effect for third-person drone-like shots. 2.29-inch tempered glass touchscreen, waterproof up to 10m (33ft).",
                    new BigDecimal("37990.00"), 10, electronics, "Camera",
                    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "SanDisk Extreme 1TB Portable External NVMe SSD (Up to 1050MB/s)",
                    "Fast NVMe solid state performance in a portable, high-capacity rugged drive. Up to 1050MB/s read and 1000MB/s write speeds. Up to 2-meter drop protection and IP55 water and dust resistance, USB-C interface.",
                    new BigDecimal("11999.00"), 30, electronics, "Storage",
                    "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Dr Trust USA Professional Acupressure Deep Tissue Massage Gun",
                    "Cordless handheld percussion massager with high-torque brushless motor. 6 intensity speed settings and 6 interchangeable massage heads for targeted myofascial relief, 4000mAh rechargeable lithium battery.",
                    new BigDecimal("2999.00"), 35, electronics, "Healthcare",
                    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Apple iPhone 15 (128 GB) - Black",
                    "Dynamic Island bubbles up alerts and Live Activities. 48MP Main camera with 2x Telephoto. Durable color-infused glass and aluminum design. A16 Bionic chip, USB-C charging with all-day battery life.",
                    new BigDecimal("69999.00"), 15, electronics, "Tech drop",
                    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)",
                    "Galaxy AI features Circle to Search, Live Translate, and Photo Assist. 200MP camera system with 5x optical zoom, Snapdragon 8 Gen 3 for Galaxy, 6.8-inch Dynamic AMOLED 2X flat display with Corning Gorilla Armor.",
                    new BigDecimal("129999.00"), 10, electronics, "Tech drop",
                    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80"
            ));

            // =========================================================================
            // SECTION 2: FASHION (25 Genuine Products)
            // =========================================================================
            productsToSave.add(createProd(
                    "Biba Women Cotton Straight Printed Kurta Set with Palazzo & Dupatta",
                    "Pure cotton ethnic kurta set featuring intricate floral block print, round neck with notch, three-quarter sleeves, matched with straight cotton palazzos and a lightweight chiffon bordered dupatta.",
                    new BigDecimal("2499.00"), 40, fashion, "Kurta sets",
                    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Libas Women Ethnic Embroidered Rayon Anarkali Kurta Set",
                    "Flared Anarkali kurta crafted from premium soft rayon with delicate zari work on the yoke, paired with comfortable churidar pants and gold-foiled dupatta. Ideal for festive gatherings and ceremonies.",
                    new BigDecimal("1799.00"), 35, fashion, "Kurta sets",
                    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Forever New Women Floral Print Tiered Fit & Flare Midi Dress",
                    "Elegant pastel floral tiered midi dress with V-neckline, self-tie fabric waist belt, flutter short sleeves, and flowy silhouette lined with breathable viscose fabric.",
                    new BigDecimal("4400.00"), 20, fashion, "Dresses",
                    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Wildcraft 35L Water-Resistant Laptop Backpack with Rain Cover",
                    "Three spacious zippered compartments with dedicated padded sleeve for up to 15.6-inch laptops. Ergonomic contoured shoulder straps with air mesh padding and integrated waterproof rain cover in bottom pouch.",
                    new BigDecimal("1699.00"), 50, fashion, "Backpacks",
                    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Zaveri Pearls Gold Plated Kundan & Green Beads Choker Necklace Set",
                    "Traditional handcrafted Kundan bridal choker set embellished with faux emerald green beads and pearls, paired with matching drop earrings and maang tikka.",
                    new BigDecimal("899.00"), 30, fashion, "Jewellery",
                    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Titan Neo Analog Blue Dial Men's Leather Strap Watch",
                    "Contemporary deep blue sunray dial with silver indices and date aperture at 3 o'clock. Sturdy stainless steel case with scratch-resistant mineral glass and genuine dark brown stitched leather strap.",
                    new BigDecimal("3495.00"), 35, fashion, "Watches",
                    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Puma Men Solid Regular Fit Windbreaker Zip-Front Hooded Jacket",
                    "windCELL technology protects against wind chill while maintaining breathability. Full front zipper, elasticated storm cuffs and hem, two secure side zip pockets, lightweight packable design.",
                    new BigDecimal("2799.00"), 30, fashion, "Jackets",
                    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Jockey Men Super Combed Cotton Ribbed Briefs (Pack of 3)",
                    "100% super combed cotton fabric with StayFresh antibacterial treatment. Soft microfiber elastic waistband prevents marks and chafing, full rear coverage for all-day comfort.",
                    new BigDecimal("599.00"), 80, fashion, "Briefs, vest",
                    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Metro Women Embellished Block Heel Ankle Strap Sandals",
                    "2.5-inch sturdy block heels with metallic cross-strap upper accented with subtle rhinestone shimmer. Cushioned insole and anti-slip textured resin outsole.",
                    new BigDecimal("1990.00"), 25, fashion, "Heels & flats",
                    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Bata Men Brown Lightweight Daily Wear Casual Fisherman Sandals",
                    "Synthetic leather straps with adjustable hook-and-loop velcro closure. Ergonomically molded footbed with arch support and flexible grooved TPR sole for superior grip.",
                    new BigDecimal("1299.00"), 45, fashion, "Sandals",
                    "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Manyavar Men Royal Jacquard Silk Blend Kurta Pyjama Set",
                    "Regal mandarin collar kurta woven with rich brocade jacquard self-pattern in maroon gold, complemented with comfortable ivory churidar pajama trousers.",
                    new BigDecimal("3999.00"), 20, fashion, "Kurta pyjama",
                    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Tokyo Talkies Women Korean Oversized Aesthetic Graphic Drop-Shoulder Tee",
                    "Trendy Seoul streetwear boxy fit t-shirt crafted from heavy 220 GSM combed cotton. Ribbed crew neckline, drop shoulders, and retro typography print on back.",
                    new BigDecimal("799.00"), 60, fashion, "Korean Store",
                    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "US Polo Assn. Men Solid Pique Pure Cotton Slim Fit Polo T-Shirt",
                    "Classic two-button placket with signature embroidered brand logo on left chest. Breathable pique cotton weave with ribbed collar and sleeve cuffs.",
                    new BigDecimal("1499.00"), 55, fashion, "Shirts,tees",
                    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Flying Machine Men Multi-Pocket Relaxed Fit Cargo Trousers",
                    "Durable cotton twill weave with utilitarian 6-pocket configuration. Relaxed thigh fit with tapered drawstring ankles, reinforced seams for rugged casual utility.",
                    new BigDecimal("1899.00"), 35, fashion, "Jeans, Cargo",
                    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Puma Unisex-Adult Smashic Low-Top Casual Leather Sneakers",
                    "Clean court-inspired tennis silhouette with soft synthetic leather upper and iconic Puma Formstrip overlay. SoftFoam+ comfort sockliner and non-marking vulcanized rubber outsole.",
                    new BigDecimal("2499.00"), 40, fashion, "Casual shoes",
                    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Nike Air Monarch IV Men Training & Cross Walking Shoes",
                    "Durable leather upper with supportive overlays and perforations for airflow. Full-length encapsulated Nike Air-Sole unit provides lightweight cushioning, durable solid rubber outsole.",
                    new BigDecimal("4795.00"), 25, fashion, "Sports shoes",
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Hopscotch Boys & Girls Cotton Printed Nightwear Pajama Set",
                    "100% soft organic cotton sleep suit set with notch collar button-front top and elasticized pajama bottoms printed with adorable space doodles.",
                    new BigDecimal("899.00"), 45, fashion, "Kids' Clothing",
                    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Kanjivaram Art Silk Woven Traditional Saree with Rich Pallu",
                    "Timeless South Indian weave with intricate floral zari jaal across the body, grand contrast temple border, and heavily ornamented pallu. Includes unstitched matching blouse piece.",
                    new BigDecimal("2899.00"), 30, fashion, "Sarees",
                    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Levi's Men's 511 Mid Rise Slim Fit Stretchable Denim Jeans",
                    "Classic 5-pocket styling in medium indigo wash with whiskering details. Slim from hip to ankle with built-in stretch elastane for all-day mobility and shape retention.",
                    new BigDecimal("2399.00"), 50, fashion, "Jeans",
                    "https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Asics Gel-Contend 8 Women Running & Walking Lightweight Shoes",
                    "Rearfoot GEL technology cushioning improves impact absorption. Engineered breathable mesh upper stretches with the foot's natural motion, OrthoLite sockliner.",
                    new BigDecimal("3499.00"), 30, fashion, "Women shoes",
                    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "American Tourister 79cm Polypropylene Hard-Sided 8-Wheel Trolley",
                    "Impact-resistant polypropylene hard shell with textured scratch-resistant finish. Smooth dual 360-degree spinner wheels, integrated TSA 3-digit combination lock, expandable packing volume.",
                    new BigDecimal("4499.00"), 20, fashion, "Trolley bags",
                    "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Ray-Ban Aviator Classic Polarized Metal Frame Sunglasses",
                    "Iconic teardrop aviator gold metal frame with polarized G-15 crystal green lenses. 100% UV400 radiation protection, eliminates glare, adjustable clear silicone nose pads.",
                    new BigDecimal("7490.00"), 15, fashion, "Sunglasses",
                    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Fastrack Trendies Quartz Analog Black Dial Women's Watch",
                    "Sleek round black dial with rose gold accents and hands. Durable silicon strap with buckle closure, 30m water resistance, Japanese quartz precision movement.",
                    new BigDecimal("1295.00"), 40, fashion, "Watches",
                    "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Allen Solly Men Slim Fit Formal Pure Cotton Spread Collar Shirt",
                    "100% fine cotton yarn with easy-iron finish. Spread collar, long sleeves with mitered button cuffs, curved hemline designed for crisp tuck-in formal styling.",
                    new BigDecimal("1699.00"), 40, fashion, "Shirts,tees",
                    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80"
            ));

            productsToSave.add(createProd(
                    "Zara Inspired Women Wide-Leg High-Rise Denim Cargo Pants",
                    "High-waisted wide-leg cut in washed light blue denim. Side utilitarian bellows cargo pockets with flap closures, belt loops, and clean raw hem.",
                    new BigDecimal("1999.00"), 35, fashion, "Jeans, Cargo",
                    "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop&q=80"
            ));

            productRepository.saveAll(productsToSave);
            log.info("Successfully seeded 50 genuine products with detailed real specifications and subcategories.");
        }
    }

    private Product createProd(String name, String desc, BigDecimal price, int stock, Category cat, String subCat, String imageUrl) {
        Product p = new Product(name, desc, price, stock, cat, subCat);
        if (imageUrl != null && !imageUrl.isEmpty()) {
            p.addImage(new ProductImage(p, imageUrl));
        }
        return p;
    }
}
