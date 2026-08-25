from flask import Flask, jsonify, request
from scraper import scraper_products
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

LARAVEL_API_URL = 'http://127.0.0.1:8000/api/products'

@app.route('/api/products', methods=['POST'])
def get_products():
    data = request.json
    urls = data.get('urls', [])
    products = scraper_products(urls)
    
    # Debugging: Print the products being sent
    print("Products to send:", products)
    
    # Send data to Laravel API
    response = requests.post(LARAVEL_API_URL, json={'products': products})
    
    if response.status_code == 200:
        return jsonify({'message': 'Products sent to Laravel API successfully'})
    else:
        return jsonify({'error': 'Failed to send products to Laravel API'}), 500
if __name__ == '__main__':
    app.run(debug=True)