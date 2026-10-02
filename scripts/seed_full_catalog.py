import urllib.request
import urllib.parse
import http.cookiejar
import re
import json
import time

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
}

def get_admin_session():
    cj = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    login_data = json.dumps({'username': 'admin', 'password': 'Admin@123'}).encode('utf-8')
    req = urllib.request.Request('http://localhost:8080/api/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
    opener.open(req)
    return opener

def get_existing_product_count(sub_category):
    try:
        url = f"http://localhost:8080/api/products?subCategory={urllib.parse.quote(sub_category)}"
        resp = urllib.request.urlopen(url, timeout=10)
        data = json.loads(resp.read().decode())
        return len(data)
    except Exception as e:
        print(f"Error checking count for '{sub_category}': {e}")
        return 0

def fetch_flipkart_products(query, max_count=25):
    url = f"https://www.flipkart.com/search?q={urllib.parse.quote(query)}"
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"  Error fetching '{query}': {e}")
        return []

    match = re.search(r'window\.__INITIAL_STATE__\s*=\s*(\{.*?\});\s*</script>', html, re.DOTALL)
    if not match:
        return []

    try:
        state = json.loads(match.group(1))
    except Exception:
        return []

    data = state.get('pageDataV4', {}).get('page', {}).get('data', {})
    products = []
    seen = set()

    def process_item(item_val):
        if not isinstance(item_val, dict):
            return
        name = item_val.get('titles', {}).get('title') or item_val.get('title') or item_val.get('name')
        if not name:
            return
        name = name.strip()
        if len(name) > 140:
            name = name[:137].rsplit(' ', 1)[0] + '...'
        if name in seen:
            return

        pricing = item_val.get('pricing', {})
        price = None
        if isinstance(pricing, dict):
            if 'finalPrice' in pricing and isinstance(pricing['finalPrice'], dict) and pricing['finalPrice'].get('value'):
                price = pricing['finalPrice']['value']
            elif 'prices' in pricing and isinstance(pricing['prices'], list) and len(pricing['prices']) > 0:
                for p in pricing['prices']:
                    if p.get('priceType') in ('SPECIAL_PRICE', 'FSP') and p.get('value'):
                        price = p['value']
                        break
                if not price and pricing['prices'][0].get('value'):
                    price = pricing['prices'][0].get('value')
        if not price or float(price) <= 0:
            return

        media = item_val.get('media', {})
        images = media.get('images', []) if isinstance(media, dict) else []
        img_url = images[0].get('url', '') if images else item_val.get('imageUrl', '')
        if '{@width}' in img_url:
            img_url = img_url.replace('{@width}', '600').replace('{@height}', '600').replace('{@quality}', '80')
        if not img_url or not img_url.startswith('http'):
            return

        key_specs = item_val.get('keySpecs', [])
        if not key_specs and 'specificationList' in item_val:
            key_specs = [s.get('value', '') for s in item_val.get('specificationList', []) if isinstance(s, dict) and s.get('value')]

        desc = f"Genuine product with verified specifications. Highlights: {', '.join(key_specs[:4])}." if key_specs else "Genuine certified product with manufacturer warranty and authentic retail specifications."

        seen.add(name)
        products.append({
            'name': name,
            'description': desc,
            'price': float(price),
            'stock': 20 + (abs(hash(name)) % 40),
            'imageUrls': [img_url]
        })

    for slot, items in data.items():
        if not isinstance(items, list):
            continue
        for it in items:
            widget = it.get('widget', {})
            slot_data = widget.get('data', {})
            if 'products' in slot_data and isinstance(slot_data['products'], list):
                for p in slot_data['products']:
                    process_item(p.get('productInfo', {}).get('value', {}))
            if 'renderableComponents' in slot_data and isinstance(slot_data['renderableComponents'], list):
                for comp in slot_data['renderableComponents']:
                    process_item(comp.get('value', {}))

    return products[:max_count]

CATALOG_MAPPING = [
    # 1. Fashion (ID: 6)
    {"catId": 6, "sub": "Kurta sets", "query": "women kurta sets embroidered dupatta", "target": 22},
    {"catId": 6, "sub": "Dresses", "query": "women western dresses party wear", "target": 22},
    {"catId": 6, "sub": "Shirts & Tees", "query": "men cotton formal slim shirts tshirts", "target": 22},
    {"catId": 6, "sub": "Jeans", "query": "men slim fit stretch jeans denim", "target": 22},
    {"catId": 6, "sub": "Shoes", "query": "men casual sneakers running sports shoes", "target": 22},
    {"catId": 6, "sub": "Watches", "query": "men luxury analog wrist watch stainless steel", "target": 22},

    # 2. Mobiles (ID: 7)
    {"catId": 7, "sub": "Flagship 5G", "query": "5g flagship mobile phones", "target": 22},
    {"catId": 7, "sub": "Budget 5G", "query": "budget 5g mobile phones smartphone", "target": 22},
    {"catId": 7, "sub": "Mobile Covers", "query": "designer mobile back covers protection case", "target": 22},
    {"catId": 7, "sub": "Chargers & Cables", "query": "type c fast charger adapter 65w cable", "target": 22},

    # 3. Electronics (ID: 1)
    {"catId": 1, "sub": "Laptops", "query": "thin and light gaming laptops ssd", "target": 22},
    {"catId": 1, "sub": "Tablets", "query": "tablets calling wifi display ipad tab", "target": 22},
    {"catId": 1, "sub": "Earphones", "query": "bluetooth true wireless earbuds earphones", "target": 22},
    {"catId": 1, "sub": "Wearables", "query": "smartwatch bluetooth calling fitness tracker", "target": 22},
    {"catId": 1, "sub": "Power Bank", "query": "power bank 20000mah fast charging", "target": 22},
    {"catId": 1, "sub": "Speakers", "query": "portable bluetooth wireless speaker bass", "target": 22},

    # 4. Beauty (ID: 8)
    {"catId": 8, "sub": "Skincare", "query": "face serum vitamin c moisturizer face wash", "target": 22},
    {"catId": 8, "sub": "Haircare", "query": "hair shampoo conditioner hair oil mask", "target": 22},
    {"catId": 8, "sub": "Fragrances", "query": "perfume eau de parfum luxury scent body spray", "target": 22},
    {"catId": 8, "sub": "Men's Grooming", "query": "men beard trimmer shaving grooming kit", "target": 22},

    # 5. Home (ID: 9)
    {"catId": 9, "sub": "Cookware & Kitchen", "query": "nonstick induction cookware kadai frying pan", "target": 22},
    {"catId": 9, "sub": "Bedsheets & Linen", "query": "pure cotton double bedsheet pillow covers", "target": 22},
    {"catId": 9, "sub": "Home Decor & Lighting", "query": "home decor table lamps wall decorative hanging", "target": 22},

    # 6. Appliances (ID: 10)
    {"catId": 10, "sub": "Kitchen Appliances", "query": "mixer grinder 750w air fryer electric kettle", "target": 22},
    {"catId": 10, "sub": "Home Comfort & Cooling", "query": "high speed ceiling fan desert air cooler", "target": 22},
    {"catId": 10, "sub": "Microwaves & Ovens", "query": "microwave oven otg convection solo", "target": 22},

    # 7. Toys, baby (ID: 11)
    {"catId": 11, "sub": "Baby Care & Diapers", "query": "baby diapers pants wipes gentle wash lotion", "target": 22},
    {"catId": 11, "sub": "Educational & Board Games", "query": "educational toys board games learning puzzle blocks", "target": 22},
    {"catId": 11, "sub": "Action Figures & Toys", "query": "diecast cars action figures rc vehicles toy", "target": 22},

    # 8. Food & Health (ID: 12)
    {"catId": 12, "sub": "Supplements & Protein", "query": "whey protein powder isolate mass gainer creatine", "target": 22},
    {"catId": 12, "sub": "Dry Fruits & Nuts", "query": "california almonds walnuts cashew nuts 1kg", "target": 22},
    {"catId": 12, "sub": "Healthy Snacks & Teas", "query": "green tea honey organic muesli granola", "target": 22},

    # 9. Auto Accessories (ID: 13)
    {"catId": 13, "sub": "Riding Gear & Helmets", "query": "full face motorcycle helmet riding gloves", "target": 22},
    {"catId": 13, "sub": "Car Utilities & Care", "query": "car vacuum cleaner microfiber car shampoo wash", "target": 22},
    {"catId": 13, "sub": "Dash Cameras & Pumps", "query": "car dash cam 1080p tyre inflator air pump", "target": 22},

    # 10. Sports & Fitness (ID: 14)
    {"catId": 14, "sub": "Fitness Equipment", "query": "dumbbells set home gym resistance bands", "target": 22},
    {"catId": 14, "sub": "Outdoor & Racquet Sports", "query": "badminton racquet shuttlecock cricket kit", "target": 22},
    {"catId": 14, "sub": "Yoga & Exercise Mats", "query": "anti skid yoga mat workout exercise foam", "target": 22},

    # 11. Furniture (ID: 15)
    {"catId": 15, "sub": "Chairs & Desks", "query": "ergonomic office chair study computer table desk", "target": 22},
    {"catId": 15, "sub": "Living & Bedroom", "query": "wooden sofa shoe rack storage wardrobe cabinet", "target": 22},
    {"catId": 15, "sub": "Beds & Mattresses", "query": "orthopedic memory foam mattress 6 inch bed", "target": 22},

    # 12. Books (ID: 16)
    {"catId": 16, "sub": "Fiction & Best Sellers", "query": "paperback fiction english bestseller novels literature", "target": 22},
    {"catId": 16, "sub": "Self-Help & Business", "query": "self help books psychology of money atomic habits", "target": 22},
    {"catId": 16, "sub": "Academic & Exam Prep", "query": "general knowledge quantitative aptitude reasoning books", "target": 22},

    # 13. 2 Wheelers (ID: 17)
    {"catId": 17, "sub": "Electric Scooters & Gear", "query": "electric scooter waterproof body cover accessories", "target": 22},
    {"catId": 17, "sub": "Bike Care & Security", "query": "motorcycle disc brake lock heavy duty chain cable", "target": 22},
    {"catId": 17, "sub": "Riding Accessories", "query": "bike mobile holder handlebar mount rain poncho", "target": 22}
]

def main():
    print("=== STARTING FULL CATALOG SEEDING FROM INTERNET (FLIPKART REAL DATA) ===")
    opener = get_admin_session()
    total_added = 0

    for idx, item in enumerate(CATALOG_MAPPING):
        cat_id = item["catId"]
        sub = item["sub"]
        query = item["query"]
        target = item["target"]

        current_cnt = get_existing_product_count(sub)
        if current_cnt >= 20:
            print(f"[{idx+1}/{len(CATALOG_MAPPING)}] Skipping '{sub}' (already has {current_cnt} items >= 20)")
            continue

        needed = max(target - current_cnt, 20)
        print(f"[{idx+1}/{len(CATALOG_MAPPING)}] Seeding '{sub}' (Current: {current_cnt}, Needs: {needed}) using query: '{query}'...")
        products = fetch_flipkart_products(query, max_count=needed + 3)
        time.sleep(0.4)

        if len(products) < needed:
            # Try secondary query
            fallback_q = sub
            print(f"  Fetching extra items using fallback query '{fallback_q}'...")
            extra = fetch_flipkart_products(fallback_q, max_count=needed - len(products) + 2)
            products.extend(extra)
            time.sleep(0.4)

        saved = 0
        for p in products:
            if current_cnt + saved >= target:
                break
            payload = {
                'name': p['name'],
                'description': p['description'],
                'price': p['price'],
                'stock': p['stock'],
                'categoryId': cat_id,
                'subCategory': sub,
                'imageUrls': p['imageUrls']
            }
            try:
                req = urllib.request.Request(
                    'http://localhost:8080/api/products',
                    data=json.dumps(payload).encode('utf-8'),
                    headers={'Content-Type': 'application/json'}
                )
                opener.open(req)
                saved += 1
            except Exception as e:
                pass

        total_added += saved
        final_cnt = get_existing_product_count(sub)
        print(f"  -> Added {saved} genuine products. Subcategory '{sub}' now has {final_cnt} products!")

    print(f"\n=== FINISHED SEEDING! Total products added in this run: {total_added} ===")

if __name__ == '__main__':
    main()
