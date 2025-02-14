"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { SIZES, MARKS, GENRES } from "../constants/filters"; // Import filter data
import Image from "next/image";
// Define the Product interface
interface Product {
  title: string;
  price: string;
  background_image: string;
  main_image: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track hover state for each product
  const [hoveredProductIndex, setHoveredProductIndex] = useState<number | null>(null);

  // Fetch products from the Flask API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/products"); 
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Display loading or error messages
  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  // Render the products
  return (
    <div className="flex p-6">
      {/* Left Sidebar for Filters */}
      <div className="w-1/4 p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Filters</h2>

        {/* Price Filter */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Price</h3>
          <input type="range" min="0" max="1000" className="w-full" />
        </div>

        {/* Size Filter */}
        <div className="mb-6 h-[5%] bg-white rounded-xl overflow-auto overscroll-contain">
          <h3 className="font-semibold mb-2">Size</h3>
          <div className="space-y-2">
            {SIZES.map((size, index) => (
              <label key={index} className="flex items-center">
                <input type="checkbox" className="mr-2" />
                {size}
              </label>
            ))}
          </div>
        </div>

        {/* Brand Filter */}
        <div className="mb-6 bg-white p-2 h-[5%] rounded-xl overflow-auto overscroll-contain">
          <h3 className="font-semibold mb-2">Brand</h3>
          <div className="space-y-2">
            {MARKS.map((brand, index) => (
              <label key={index} className="flex items-center">
                <input type="checkbox" className="mr-2" />
                {brand}
              </label>
            ))}
          </div>
        </div>

        {/* Genre Filter */}
        <div className="mb-6 bg-white">
          <h3 className="font-semibold mb-2">Genre</h3>
          <div className="space-y-2">
            {GENRES.map((genre, index) => (
              <label key={index} className="flex items-center">
                <input type="checkbox" className="mr-2" />
                {genre}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="w-3/4 pl-6">
        <h1 className="text-2xl font-bold mb-6">Product List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg shadow-sm text-center relative"
              onMouseEnter={() => setHoveredProductIndex(index)} // Set hover state
              onMouseLeave={() => setHoveredProductIndex(null)} // Clear hover state
            >
              {/* Background Image */}
          
<Image
              
              src={product.background_image}
              alt={product.title}
              width={200} 
              height={200} 
              className="w-full h-48 object-contain mx-auto"
              style={{
               
                display: hoveredProductIndex === index ? "block" : "none", // Show only on hover
              }}
            />
              {/* Main Image */}
              <Image
              
                src={product.main_image}
                alt={product.title}
                width={200}
                height={200}
                className="w-full h-48 object-contain mx-auto"
                style={{
                  display: hoveredProductIndex === index ? "none" : "block", // Hide on hover
                }}
              />

              {/* Product Details */}
              <h3 className="text-lg font-semibold mt-2">{product.title}</h3>
              <p className="text-gray-600">{product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;