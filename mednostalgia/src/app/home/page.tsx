"use client"
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
    <div>
      <h1>Product List</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {products.map((product, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '10px', width: '200px', textAlign: 'center' }}>
            <Image
              src={product.image}
              alt={product.title}
              width={200}
              height={200}
              unoptimized
            />
            <h3>{product.title}</h3>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
