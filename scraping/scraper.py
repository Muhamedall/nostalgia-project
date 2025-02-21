from playwright.sync_api import sync_playwright
import requests
import json
import time

LARAVEL_API_URL = "http://127.0.0.1:8000/api/products"  # Update if needed

def scrape_page(url, retries=3):
    """Scrape a page with retry logic."""
    success = False
    products = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # Debug: Show browser
        for attempt in range(retries):
            try:
                print(f"🔄 Attempting to scrape: {url}")
                page = browser.new_page(user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
                page.goto(url, timeout=60000)
                page.wait_for_selector('.shopify-section', timeout=60000)

                # Debugging: Print number of product blocks found
                product_blocks = page.query_selector_all('.block-inner')
                print(f"🟢 Found {len(product_blocks)} product blocks on {url}")

                # Extract product data
                for item in product_blocks:
                    try:
                        title = item.query_selector('.product-block__title')
                        title_text = title.inner_text().strip() if title else "No title"

                        price = item.query_selector('.product-price')
                        price_text = price.inner_text().strip() if price else "No price"

                        background_image_container = item.query_selector('.rimage-background')
                        background_image_url = background_image_container.get_attribute('data-lazy-bgset-src') if background_image_container else "No background image"

                        main_image = item.query_selector('.rimage__image')
                        main_image_url = main_image.get_attribute('src') if main_image else "No main image"

                        products.append({
                            'title': title_text,
                            'price': price_text,
                            'background_image': background_image_url,
                            'main_image': main_image_url,
                        })
                    except Exception as e:
                        print(f"❌ Error extracting product data: {e}")

                if products:
                    success = True
                    print(f"✅ Extracted {len(products)} products from {url}")
                page.close()
                break  # Exit retry loop if successful
            except Exception as e:
                print(f"⚠️ Attempt {attempt + 1} failed for {url}: {e}")
                if attempt == retries - 1:
                    print(f"❌ Failed to load {url} after {retries} attempts")
                time.sleep(5)  # Retry after 5 seconds
        browser.close()
    
    return products, success

def scraper_products(urls):
    all_products = []
    for url in urls:
        print(f"🔄 Scraping URL: {url}")
        products, success = scrape_page(url)
        
        if success:
            all_products.extend(products)
        else:
            print(f"🚨 Skipped {url} due to repeated failures!")

    return all_products

# Function to send data to Laravel API
def send_to_laravel(products):
    if not products:
        print("❌ No products to send!")
        return

    print(f"📤 Sending {len(products)} products to Laravel API...")
    headers = {"Content-Type": "application/json"}
    data = {"products": products}

    try:
        response = requests.post(LARAVEL_API_URL, headers=headers, json=data)
        print(f"🟢 Laravel API Response: {response.status_code}")
        print(response.json())  # Debugging API response
    except Exception as e:
        print(f"❌ Failed to send data to Laravel: {e}")

# Run scraper and send data
if __name__ == '__main__':
    urls = [
        'https://www.beyondretro.com/collections/all',
        'https://www.beyondretro.com/collections/all?page=2',
        'https://www.beyondretro.com/collections/all?page=3',
        # Add more URLs here
    ]
    
    # Scrape products from URLs
    products = scraper_products(urls)

    # Send data to Laravel if products were found
    if products:
        send_to_laravel(products)
    else:
        print("❌ No products found! Check the scraper.")
