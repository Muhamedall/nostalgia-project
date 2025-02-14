<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    // Store or update products
    public function store(Request $request)
    {
        $products = $request->input('products');

        foreach ($products as $productData) {
            Product::updateOrCreate(
                ['title' => $productData['title']], 
                [
                    'price' => $productData['price'],
                    'background_image' => $productData['background_image'],
                    'main_image' => $productData['main_image']
                ]
            );
        }

        return response()->json(['message' => 'Products saved successfully']);
    }

    // Fetch all products
    public function index()
    {
        $products = Product::all(); // Fetch all products from the database
        return response()->json($products); // Return products as JSON
    }
}