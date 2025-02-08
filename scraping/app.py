from flask import Flask, jsonify
from scraper import scraper_products
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.route('/api/products', methods=['GET'])
def get_products():
    url = 'https://www.beyondretro.com/collections/all'
    products = scraper_products(url)
    return jsonify(products)

if __name__ == '__main__':
    app.run(debug=True)