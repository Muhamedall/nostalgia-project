"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchFavorites } from "@/lib/features/favoritesSlice";
import Link from "next/link";
import Image from "next/image";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { addFavorite, removeFavorite } from "@/lib/features/favoritesSlice";
import toast from "react-hot-toast";

export default function FavoriteList() {
  const dispatch = useAppDispatch();
  const { favoriteProducts, loading, error } = useAppSelector((state) => state.favorites);
  const products = useAppSelector((state) => state.products.items);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleToggleFavorite = (productId: number) => {
    const isFavorite = favoriteProducts.includes(productId);
    if (isFavorite) {
      dispatch(removeFavorite(productId))
        .unwrap()
        .then(() => toast.success("Removed from favorites"))
        .catch(() => toast.error("Failed to remove favorite"));
    } else {
      dispatch(addFavorite(productId))
        .unwrap()
        .then(() => toast.success("Added to favorites"))
        .catch(() => toast.error("Failed to add favorite"));
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  if (favoriteProducts.length === 0) return (
    <div className="text-center py-12">
      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <h3 className="mt-2 text-lg font-medium text-gray-900">No favorites yet</h3>
      <p className="mt-1 text-sm text-gray-500">Start adding products to your favorites list.</p>
      <div className="mt-6">
        <Link href="/products" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Browse Products
        </Link>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-8">My Favorites</h2>
        
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {favoriteProducts.map((productId) => {
            const product = products.find(p => p.id === productId);
            if (!product) return null;
            
            return (
              <div key={productId} className="group relative">
                <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                  <Image
                    src={product.main_image}
                    alt={product.title}
                    width={300}
                    height={300}
                    className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link href={`/products/${product.title.toLowerCase().replace(/ /g, '-')}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Color: Black</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${product.price}</p>
                </div>
                <button
                  onClick={() => handleToggleFavorite(productId)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 focus:outline-none"
                  aria-label={favoriteProducts.includes(productId) ? "Remove from favorites" : "Add to favorites"}
                >
                  {favoriteProducts.includes(productId) ? (
                    <FaHeart className="h-5 w-5 text-red-500" />
                  ) : (
                    <FaRegHeart className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}