"use client";

import { useParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import Image from "next/image";
import { FaCartPlus, FaHeart, FaRegHeart } from "react-icons/fa";
import { addFavorite, removeFavorite } from "@/lib/features/favoritesSlice";
import { useEffect } from "react";
import { fetchFavorites } from "@/lib/features/favoritesSlice";
import toast from "react-hot-toast";

interface FavoriteButtonProps {
  productId: number;
}

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ProductPage({ productId }: FavoriteButtonProps) {
  const params = useParams();
  const dispatch = useAppDispatch();
  const products = useAppSelector((state: RootState) => state.products.items);
  const favorites = useAppSelector((state) => state.favorites.favoriteProducts);
  const { loading: favoritesLoading } = useAppSelector((state) => state.favorites);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const product = products.find((p) => generateSlug(p.title) === params.slug);

  if (!product) return <h1 className="text-2xl font-bold text-center my-10">Product not found</h1>;

  const isFavorite = favorites.includes(product.id);

  const handleFavoriteClick = () => {
    if (isFavorite) {
      dispatch(removeFavorite(product.id))
        .unwrap()
        .then(() => toast.success("Removed from favorites"))
        .catch(() => toast.error("Failed to remove favorite"));
    } else {
      dispatch(addFavorite(product.id))
        .unwrap()
        .then(() => toast.success("Added to favorites"))
        .catch(() => toast.error("Failed to add favorite"));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Images */}
        <div className="w-full md:w-1/2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <Image
              src={product.main_image}
              alt={product.title}
              width={800}
              height={800}
              className="w-full h-auto object-contain"
              quality={100}
              priority
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[product.main_image, product.background_image, product.main_image].map((img, index) => (
              <div key={index} className="bg-white rounded-md shadow-sm overflow-hidden">
                <Image
                  src={img}
                  alt={`${product.title} thumbnail ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-auto object-cover"
                  quality={90}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center text-yellow-400 mr-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600 text-sm">(24 reviews)</span>
          </div>

          <div className="mb-6">
            <span className="text-2xl font-semibold text-gray-900">${product.price}</span>
            {product.original_price && (
              <span className="ml-2 text-lg text-gray-500 line-through">${product.original_price}</span>
            )}
            {product.original_price && (
              <span className="ml-2 text-sm font-medium text-green-600">
                {Math.round((1 - product.price / product.original_price) * 100)}% off
              </span>
            )}
          </div>

          <p className="text-gray-700 mb-6">{product.description || "No description available."}</p>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900">Highlights</h3>
            <ul className="mt-2 pl-4 list-disc text-sm text-gray-600 space-y-1">
              <li>Premium quality materials</li>
              <li>Designed for comfort and durability</li>
              <li>Eco-friendly production</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <h3 className="text-sm font-medium text-gray-900">Details</h3>
            <div className="mt-2 text-sm text-gray-600">
              <p>Material: 100% Organic Cotton</p>
              <p>Weight: 0.5 kg</p>
              <p>Dimensions: 30 x 20 x 5 cm</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex-1 flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <FaCartPlus className="mr-2" />
              Add to Cart
            </button>

            <button
              onClick={handleFavoriteClick}
              disabled={favoritesLoading}
              className={`flex items-center justify-center px-4 py-3 border border-gray-300 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                isFavorite
                  ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {isFavorite ? (
                <>
                  <FaHeart className="mr-2 text-red-500" />
                  Favorited
                </>
              ) : (
                <>
                  <FaRegHeart className="mr-2" />
                  Favorite
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Product Description Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
        <div className="prose max-w-none text-gray-600">
          <p>
            This premium product is crafted with the finest materials to ensure longevity and comfort. 
            The attention to detail in every stitch and seam guarantees a product that not only looks 
            great but stands the test of time.
          </p>
          <p className="mt-4">
            Our eco-friendly production process means you can feel good about your purchase, knowing 
            it was made with minimal environmental impact. The versatile design makes it suitable 
            for various occasions and settings.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Premium Quality</h3>
          <p className="mt-2 text-gray-600">
            Made with the finest materials for unmatched durability and comfort.
          </p>
        </div>

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Fast Shipping</h3>
          <p className="mt-2 text-gray-600">
            Get your order delivered to your doorstep in 2-3 business days.
          </p>
        </div>

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Eco-Friendly</h3>
          <p className="mt-2 text-gray-600">
            Sustainably produced with minimal environmental impact.
          </p>
        </div>
      </div>
    </div>
  );
}