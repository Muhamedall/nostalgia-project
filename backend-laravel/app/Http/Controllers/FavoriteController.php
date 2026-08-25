<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FavoriteController extends Controller
{
    /**
     * Display all favorite products of the authenticated user.
     */
    public function index()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $favorites = $user->favoriteProducts()->get(['id', 'title', 'price', 'main_image']);
        return response()->json($favorites, 200);
    }

    /**
     * Add a product to favorites.
     */
    public function store(Request $request)
    {
        Log::info('Favorite store request:', $request->all());
        Log::info('Authenticated user:', Auth::user() ? Auth::user()->id : 'none');

        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $productId = $request->product_id;

        if ($user->favoriteProducts()->where('product_id', $productId)->exists()) {
            return response()->json([
                'message' => 'Product is already in favorites',
                'product_id' => $productId
            ], 200);
        }

        $user->favoriteProducts()->attach($productId);

        return response()->json([
            'message' => 'Product added to favorites',
            'product_id' => $productId
        ], 201);
    }

    /**
     * Remove a product from favorites.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $product = Product::findOrFail($id);
        $user->favoriteProducts()->detach($product->id);

        return response()->json([
            'message' => 'Product removed from favorites',
            'product_id' => $id
        ], 200);
    }
}