"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { SIZES, MARKS, GENRES } from "../constants/filters"; // Import filter data
import Image from "next/image";
import { IoMdArrowDropdown, IoMdArrowDropup} from "react-icons/io";
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

  // Single state to manage visibility of all filter sections
  const [showFilters, setShowFilters] = useState<{ [key: string]: boolean }>({
    size: true,
    brand: true,
    genre: true,
  });

  // Toggle visibility for a specific filter section
  const toggleFilter = (filterKey: string) => {
    setShowFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

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
      {/* Floating Filter Button (Mobile Only) */}
      <button
        onClick={() => setShowFiltersModal(true)}
        className="fixed bottom-4 right-4 p-3 bg-[#F4EBD0] rounded-full shadow-lg lg:hidden z-50"
      >
        <IoFilter className="text-2xl" />
      </button>

      {/* Left Sidebar for Filters (Desktop) */}
      <div className="hidden lg:block w-1/4 h-[50%] p-4 bg-[#F4EBD0] rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Filters</h2>

        {/* Price Filter */}
        <div className="mb-6 bg-white p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Price $</h3>
          <input type="range" min="0" max="1000" className="w-full" />
        </div>

        {/* Size Filter */}
        <div className="mb-6 bg-white p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Size</h3>
            <span
              onClick={() => toggleFilter("size")}
              className="cursor-pointer"
            >
              {showFilters.size ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
            </span>
          </div>
          {showFilters.size && (
            <div className="space-y-2 mt-2 overflow-auto overscroll-contain max-h-40">
              {SIZES.map((size, index) => (
                <label key={index} className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  {size}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Brand Filter */}
        <div className="mb-6 bg-white p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Brand</h3>
            <span
              onClick={() => toggleFilter("brand")}
              className="cursor-pointer"
            >
              {showFilters.brand ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
            </span>
          </div>
          {showFilters.brand && (
            <div className="space-y-2 mt-2 overflow-auto overscroll-contain max-h-40">
              {MARKS.map((brand, index) => (
                <label key={index} className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  {brand}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Genre Filter */}
        <div className="mb-6 bg-white p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Genre</h3>
            <span
              onClick={() => toggleFilter("genre")}
              className="cursor-pointer"
            >
              {showFilters.genre ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
            </span>
          </div>
          {showFilters.genre && (
            <div className="space-y-2 mt-2 overflow-auto overscroll-contain max-h-40">
              {GENRES.map((genre, index) => (
                <label key={index} className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  {genre}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filters Modal (Mobile) */}
      {showFiltersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed inset-y-0 left-0 w-3/4 bg-[#F4EBD0] p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Filters</h2>

            {/* Close Button */}
            <button
              onClick={() => setShowFiltersModal(false)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg"
            >
              ✕
            </button>

            {/* Price Filter */}
            <div className="mb-6 bg-white p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Price $</h3>
              <input type="range" min="0" max="1000" className="w-full" />
            </div>

            {/* Size Filter */}
            <div className="mb-6 bg-white p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Size</h3>
                <span
                  onClick={() => toggleFilter("size")}
                  className="cursor-pointer"
                >
                  {showFilters.size ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                </span>
              </div>
              {showFilters.size && (
                <div className="space-y-2 mt-2 overflow-auto overscroll-contain max-h-40">
                  {SIZES.map((size, index) => (
                    <label key={index} className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      {size}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Brand Filter */}
            <div className="mb-6 bg-white p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Brand</h3>
                <span
                  onClick={() => toggleFilter("brand")}
                  className="cursor-pointer"
                >
                  {showFilters.brand ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                </span>
              </div>
              {showFilters.brand && (
                <div className="space-y-2 mt-2 overflow-auto overscroll-contain max-h-40">
                  {MARKS.map((brand, index) => (
                    <label key={index} className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      {brand}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Genre Filter */}
            <div className="mb-6 bg-white p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Genre</h3>
                <span
                  onClick={() => toggleFilter("genre")}
                  className="cursor-pointer"
                >
                  {showFilters.genre ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                </span>
              </div>
              {showFilters.genre && (
                <div className="space-y-2 mt-2 overflow-auto overscroll-contain max-h-40">
                  {GENRES.map((genre, index) => (
                    <label key={index} className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      {genre}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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