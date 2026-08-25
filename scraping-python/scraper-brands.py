from playwright.sync_api import sync_playwright

def scraper_brands(url):
    with sync_playwright() as p:
        # Launch the browser
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url)

        # Wait for the brand items to load
        page.wait_for_selector('.shogun-root')

        # Extract product data
        brands = []
        for item in page.query_selector_all('.shg-rich-text'):
            try:
                # Find all <a> tags inside <h3>
                brand_links = item.query_selector_all('h3 a')
                for link in brand_links:
                    title = link.inner_text().strip()
                    # Append brand data to the list
                    brands.append({
                        'title': title,
                    })
            except Exception as e:
                print(f"Error extracting data: {e}")

        # Close the browser
        browser.close()
        return brands

if __name__ == '__main__':
    url = 'https://www.beyondretro.com/pages/a-z-of-brands'
    brands = scraper_brands(url)
    for brand in brands:
        print(brand)