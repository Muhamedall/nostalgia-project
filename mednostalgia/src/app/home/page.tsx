"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

// Define the Product interface
interface Product {
  title: string;
  price: string;
  image: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from the Flask API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/products'); // Corrected URL
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please try again later.');
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
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Size</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Small
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Medium
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Large
            </label>
          </div>
        </div>

        {/* Brand Filter */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Brand</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Nike
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Puma
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Adidas
            </label>
          </div>
        </div>

        {/* Genre Filter */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Genre</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Femme
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Homme
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Unisex
            </label>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="w-3/4 pl-6">
        <h1 className="text-2xl font-bold mb-6">Product List</h1>
        <div className="grid grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-sm text-center">
              <Image
                src={product.image}
                alt={product.title}
                width={200}
                height={200}
                unoptimized
                className="mx-auto"
              />
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