"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

import Image from "next/image";
import FilterSidebar from "../FilterSiderbar";
import ProductsSkeleton from "@/components/skeleton/ProductsSkeleton";
import FilterSidebarSkeleton from "@/components/skeleton/FilterSidebarSkeleton";
import { IoFilter } from "react-icons/io5";
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
  const [hoveredProductIndex, setHoveredProductIndex] = useState<number | null>(null);
  const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false); // State for mobile filter modal

  
 

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


  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex p-6">
        <FilterSidebarSkeleton />
        <ProductsSkeleton />
      </div>
    );
  }


  // Display loading or error messages
  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  // Render the products
  return (
    <div className="flex p-6">
      {/* Floating Filter Button (Mobile Only) */}
      <button
        onClick={() => setShowFiltersModal(true)}
        className="fixed bottom-4 right-4 p-3 bg-[#F4EBD0] rounded-full shadow-lg lg:hidden z-50"
      >
        <IoFilter className="text-2xl" />
      </button>

      
      <FilterSidebar showFiltersModal={showFiltersModal}  setShowFiltersModal={setShowFiltersModal} />
      {/* Product Grid */}
      <div className="w-full lg:w-3/4 pl-6">
        <h1 className="text-2xl font-bold mb-6">Product List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg shadow-sm text-center relative"
              onMouseEnter={() => setHoveredProductIndex(index)}
              onMouseLeave={() => setHoveredProductIndex(null)}
            >
              {/* Background Image */}
              <Image
                src={product.background_image}
                alt={product.title}
                width={200}
                height={200}
                className="w-full h-48 object-contain mx-auto"
                style={{
                  display: hoveredProductIndex === index ? "block" : "none",
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
                  display: hoveredProductIndex === index ? "none" : "block",
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