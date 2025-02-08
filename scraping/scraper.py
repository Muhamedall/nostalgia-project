from playwright.sync_api import sync_playwright

def scraper_products(url):
    with sync_playwright() as p:
        # Launch the browser
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url)

        # Wait for the product items to load
        page.wait_for_selector('.shopify-section ')

        # Extract product data
        products = []
        for item in page.query_selector_all('.block-inner'):
            try:
                # Extract title
                title = item.query_selector('.product-block__title').inner_text().strip()

                # Extract price
                price = item.query_selector('.product-price').inner_text().strip()

                # Extract image URL
                image = item.query_selector('.rimage__image').get_attribute('src')

                # Append product data to the list
                products.append({
                    'title': title,
                    'price': price,
                    'image': image,
                })
            except Exception as e:
                print(f"Error extracting data: {e}")

        # Close the browser
        browser.close()
        return products

if __name__ == '__main__':
    url = 'https://www.beyondretro.com/collections/all'
    products = scraper_products(url)
    for product in products:
        print(product)