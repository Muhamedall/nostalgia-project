<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Log;
use Throwable;

class ProductController extends Controller
{
    /**
     * Store / update scraped products.
     */
    public function store(Request $request)
    {
        try {

            $products = $request->input('products', []);

            if (!is_array($products)) {

                return response()->json([
                    'success' => false,
                    'message' => 'Products must be an array.',
                ], 422);
            }

            Log::info(
                'Incoming products count: ' . count($products)
            );

            $created = 0;
            $updated = 0;

            foreach ($products as $productData) {

                /*
                |--------------------------------------------------------------------------
                | Basic validation
                |--------------------------------------------------------------------------
                */

                if (empty($productData['title'])) {

                    Log::warning(
                        'Product skipped: missing title',
                        $productData
                    );

                    continue;
                }

                /*
                |--------------------------------------------------------------------------
                | Product data
                |--------------------------------------------------------------------------
                */

                $images = $productData['images'] ?? [];

                /*
                |--------------------------------------------------------------------------
                | Keep compatibility with your old database fields
                |--------------------------------------------------------------------------
                */

                $mainImage = $images[0] ?? null;

                $backgroundImage = $images[1]
                    ?? $images[0]
                    ?? null;

                /*
                |--------------------------------------------------------------------------
                | Find existing product
                |--------------------------------------------------------------------------
                */

                $product = null;

                /*
                |--------------------------------------------------------------------------
                | First priority: Shopify external ID
                |--------------------------------------------------------------------------
                */

                if (!empty($productData['external_id'])) {

                    $product = Product::where(
                        'external_id',
                        $productData['external_id']
                    )->first();
                }

                /*
                |--------------------------------------------------------------------------
                | Second priority: product URL
                |--------------------------------------------------------------------------
                */

                if (!$product && !empty($productData['url'])) {

                    $product = Product::where(
                        'url',
                        $productData['url']
                    )->first();
                }

                /*
                |--------------------------------------------------------------------------
                | Third priority: old title matching
                |--------------------------------------------------------------------------
                */

                if (!$product) {

                    $product = Product::where(
                        'title',
                        $productData['title']
                    )->first();
                }

                /*
                |--------------------------------------------------------------------------
                | Data to save
                |--------------------------------------------------------------------------
                */

                $data = [

                    'external_id' =>
                        $productData['external_id'] ?? null,

                    'title' =>
                        $productData['title'],

                    'price' =>
                        $productData['price'] ?? '',

                    'old_price' =>
                        $productData['old_price'] ?? null,

                    'description' =>
                        $productData['description'] ?? null,

                    'sku' =>
                        $productData['sku'] ?? null,

                    'url' =>
                        $productData['url'] ?? null,

                    'images' =>
                        $images,

                    'source' =>
                        $productData['source']
                        ?? 'beyondretro',

                    'handle' =>
                        $productData['handle'] ?? null,

                    'available' =>
                        $productData['available'] ?? true,

                    /*
                    |--------------------------------------------------------------------------
                    | Old fields - compatibility with your existing frontend
                    |--------------------------------------------------------------------------
                    */

                    'background_image' =>
                        $backgroundImage,

                    'main_image' =>
                        $mainImage,
                ];

                /*
                |--------------------------------------------------------------------------
                | Create / update
                |--------------------------------------------------------------------------
                */

                if ($product) {

                    $product->update($data);

                    $updated++;

                } else {

                    Product::create($data);

                    $created++;
                }
            }

            /*
            |--------------------------------------------------------------------------
            | Response
            |--------------------------------------------------------------------------
            */

            return response()->json([

                'success' => true,

                'message' =>
                    'Products saved successfully.',

                'created' =>
                    $created,

                'updated' =>
                    $updated,

                'total' =>
                    count($products),
            ]);

        } catch (Throwable $e) {

            /*
            |--------------------------------------------------------------------------
            | Log real error
            |--------------------------------------------------------------------------
            */

            Log::error(
                'Product scraping import failed.',
                [
                    'message' =>
                        $e->getMessage(),

                    'file' =>
                        $e->getFile(),

                    'line' =>
                        $e->getLine(),
                ]
            );

            /*
            |--------------------------------------------------------------------------
            | Return error during development
            |--------------------------------------------------------------------------
            */

            return response()->json([

                'success' => false,

                'message' =>
                    'Failed to save products.',

                'error' =>
                    $e->getMessage(),

                'file' =>
                    $e->getFile(),

                'line' =>
                    $e->getLine(),

            ], 500);
        }
    }


    /**
     * Fetch all products.
     */
  

    public function index()
{
    return response()->json(
        Product::latest()->get()
    );
}
}
