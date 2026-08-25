import requests
import json
import time
import re
from urllib.parse import urljoin


# ============================================================
# CONFIGURATION
# ============================================================

SHOP_URL = "https://shop.beyondretro.com"

# Shopify endpoint
PRODUCTS_ENDPOINT = f"{SHOP_URL}/collections/all/products.json"

# Laravel API
LARAVEL_API_URL = "http://127.0.0.1:8000/api/products"

# Shopify allows up to 250 products per request
PRODUCTS_PER_PAGE = 250

# Maximum number of pages
# Current store has around 6837 products,
# so 30 pages is enough for now.
MAX_PAGES = 30

# Retry configuration
MAX_RETRIES = 3

# Delay between requests
REQUEST_DELAY = 1

# Laravel batch size
LARAVEL_BATCH_SIZE = 50

# Request timeout
REQUEST_TIMEOUT = 60

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/139.0.0.0 Safari/537.36"
)


# ============================================================
# HTTP SESSION
# ============================================================

session = requests.Session()

session.headers.update({
    "User-Agent": USER_AGENT,
    "Accept": "application/json,text/html,*/*",
    "Accept-Language": "en-US,en;q=0.9",
})


# ============================================================
# HELPERS
# ============================================================

def clean_text(value):
    """
    Clean whitespace from text.
    """

    if not value:
        return ""

    value = re.sub(r"\s+", " ", value)

    return value.strip()


def html_to_text(html):
    """
    Convert basic HTML description to readable text.
    """

    if not html:
        return ""

    # Remove script/style
    html = re.sub(
        r"<(script|style).*?>.*?</\1>",
        "",
        html,
        flags=re.DOTALL | re.IGNORECASE
    )

    # Replace HTML tags with spaces
    html = re.sub(r"<[^>]+>", " ", html)

    # Decode common HTML entities
    html = (
        html
        .replace("&nbsp;", " ")
        .replace("&amp;", "&")
        .replace("&quot;", '"')
        .replace("&#39;", "'")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
    )

    return clean_text(html)


def request_json(url, params=None):
    """
    GET JSON with retry logic.
    """

    for attempt in range(1, MAX_RETRIES + 1):

        try:

            print(
                f"🌐 GET {url}"
            )

            response = session.get(
                url,
                params=params,
                timeout=REQUEST_TIMEOUT
            )

            print(
                f"   HTTP {response.status_code}"
            )

            response.raise_for_status()

            return response.json()

        except requests.exceptions.RequestException as e:

            print(
                f"❌ Request failed "
                f"(attempt {attempt}/{MAX_RETRIES})"
            )

            print(
                f"   {e}"
            )

            if attempt < MAX_RETRIES:

                print("🔄 Retrying in 3 seconds...")

                time.sleep(3)

            else:

                print("❌ Maximum retries reached.")

    return None


# ============================================================
# SHOPIFY PRODUCT NORMALIZATION
# ============================================================

def normalize_product(product):
    """
    Convert Shopify product JSON into our application format.
    """

    product_id = product.get("id")

    title = clean_text(
        product.get("title", "")
    )

    handle = product.get(
        "handle",
        ""
    )

    # Shopify product URL
    product_url = urljoin(
        SHOP_URL,
        f"/products/{handle}"
    )

    # --------------------------------------------------------
    # DESCRIPTION
    # --------------------------------------------------------

    description_html = product.get(
        "body_html",
        ""
    )

    description = html_to_text(
        description_html
    )

    # --------------------------------------------------------
    # IMAGES
    # --------------------------------------------------------

    images = []

    for image in product.get("images", []):

        src = image.get("src")

        if not src:
            continue

        if src not in images:

            images.append(src)

    # --------------------------------------------------------
    # VARIANTS
    # --------------------------------------------------------

    variants = product.get(
        "variants",
        []
    )

    price = None
    old_price = None
    sku = None

    if variants:

        # For vintage products, normally there is one variant.
        variant = variants[0]

        price = variant.get(
            "price"
        )

        old_price = variant.get(
            "compare_at_price"
        )

        sku = variant.get(
            "sku"
        )

    # --------------------------------------------------------
    # ALL SKUS
    # --------------------------------------------------------

    skus = []

    for variant in variants:

        variant_sku = variant.get("sku")

        if variant_sku:

            skus.append(
                variant_sku
            )

    # --------------------------------------------------------
    # PRODUCT DATA
    # --------------------------------------------------------

    return {
        "external_id": product_id,

        "title": title,

        "price": price,

        "old_price": old_price,

        "description": description,

        "sku": sku,

        "url": product_url,

        "images": images,

        "source": "beyondretro",

        "handle": handle,

        "available": any(
            variant.get("available", False)
            for variant in variants
        ),

        "variants": variants,

        "all_skus": skus,
    }


# ============================================================
# SCRAPE PRODUCTS
# ============================================================

def scrape_products():
    """
    Scrape products from Shopify JSON endpoint.
    """

    all_products = []

    seen_ids = set()

    print()
    print("=" * 60)
    print("       BEYOND RETRO SHOPIFY SCRAPER")
    print("=" * 60)
    print()

    for page in range(1, MAX_PAGES + 1):

        print()
        print("=" * 60)

        print(
            f"📄 PAGE {page}/{MAX_PAGES}"
        )

        print("=" * 60)

        params = {
            "limit": PRODUCTS_PER_PAGE,
            "page": page
        }

        data = request_json(
            PRODUCTS_ENDPOINT,
            params=params
        )

        if data is None:

            print(
                "🚨 Could not retrieve page."
            )

            break

        products = data.get(
            "products",
            []
        )

        print(
            f"📦 Products received: "
            f"{len(products)}"
        )

        # ----------------------------------------------------
        # Stop when no products
        # ----------------------------------------------------

        if not products:

            print(
                "🛑 No more products."
            )

            break

        # ----------------------------------------------------
        # Normalize products
        # ----------------------------------------------------

        for product in products:

            product_id = product.get(
                "id"
            )

            # Deduplicate
            if product_id in seen_ids:

                continue

            seen_ids.add(
                product_id
            )

            normalized = normalize_product(
                product
            )

            all_products.append(
                normalized
            )

        print(
            f"🟢 Total unique products: "
            f"{len(all_products)}"
        )

        # ----------------------------------------------------
        # If fewer than 250, this is probably last page
        # ----------------------------------------------------

        if len(products) < PRODUCTS_PER_PAGE:

            print(
                "🛑 Last page detected."
            )

            break

        time.sleep(
            REQUEST_DELAY
        )

    return all_products


# ============================================================
# PRINT SAMPLE
# ============================================================

def print_sample(products):

    if not products:

        print(
            "❌ No products available."
        )

        return

    print()
    print("=" * 60)
    print("             SAMPLE PRODUCTS")
    print("=" * 60)

    for product in products[:5]:

        print()

        print(
            f"🆔 ID: "
            f"{product['external_id']}"
        )

        print(
            f"🏷️ Title: "
            f"{product['title']}"
        )

        print(
            f"💰 Price: "
            f"{product['price']}"
        )

        print(
            f"💸 Old price: "
            f"{product['old_price']}"
        )

        print(
            f"🔖 SKU: "
            f"{product['sku']}"
        )

        print(
            f"🖼️ Images: "
            f"{len(product['images'])}"
        )

        print(
            f"🔗 URL: "
            f"{product['url']}"
        )


# ============================================================
# SAVE JSON
# ============================================================

def save_json(products):

    try:

        with open(
            "products.json",
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                products,
                file,
                ensure_ascii=False,
                indent=4
            )

        print()
        print(
            "💾 products.json saved successfully."
        )

    except Exception as e:

        print(
            f"❌ Failed to save JSON: {e}"
        )


# ============================================================
# SEND BATCH TO LARAVEL
# ============================================================

def send_batch_to_laravel(products):

    if not products:

        return False

    payload = {
        "products": products
    }

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    try:

        response = requests.post(
            LARAVEL_API_URL,
            json=payload,
            headers=headers,
            timeout=REQUEST_TIMEOUT
        )

        print(
            f"📤 Laravel HTTP "
            f"{response.status_code}"
        )

        try:

            result = response.json()

            print(
                f"   {result}"
            )

        except ValueError:

            print(
                response.text
            )

        response.raise_for_status()

        return True

    except requests.exceptions.RequestException as e:

        print(
            f"❌ Laravel request failed: {e}"
        )

        return False


# ============================================================
# SEND ALL PRODUCTS
# ============================================================

def send_to_laravel(products):

    if not products:

        print(
            "❌ Nothing to send to Laravel."
        )

        return

    total = len(products)

    print()
    print("=" * 60)

    print(
        f"📤 Sending {total} products "
        f"to Laravel"
    )

    print("=" * 60)

    successful = 0

    for start in range(
        0,
        total,
        LARAVEL_BATCH_SIZE
    ):

        end = min(
            start + LARAVEL_BATCH_SIZE,
            total
        )

        batch = products[
            start:end
        ]

        batch_number = (
            start // LARAVEL_BATCH_SIZE
        ) + 1

        print()
        print(
            f"📦 Batch {batch_number}: "
            f"{start + 1}-{end}/{total}"
        )

        success = send_batch_to_laravel(
            batch
        )

        if success:

            successful += len(
                batch
            )

        else:

            print(
                "⚠️ Batch failed."
            )

    print()
    print(
        f"✅ Successfully sent: "
        f"{successful}/{total}"
    )


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":

    products = scrape_products()

    print()
    print("=" * 60)

    print(
        f"🎉 SCRAPING FINISHED"
    )

    print(
        f"📦 Total products: "
        f"{len(products)}"
    )

    print("=" * 60)

    # Show sample
    print_sample(
        products
    )

    # Save locally
    save_json(
        products
    )

    # Send to Laravel
    if products:

        send_to_laravel(
            products
        )

    else:

        print()
        print(
            "🚨 NO PRODUCTS FOUND!"
        )

        print(
            "The Shopify JSON endpoint "
            "may no longer be available."
        )