"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoFilter } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchProducts } from "@/lib/features/productsSlice";
import { RootState } from "@/lib/store";
import FilterSidebar from "../home/FilterSiderbar";
import ProductsSkeleton from "@/components/skeleton/ProductsSkeleton";
import FilterSidebarSkeleton from "@/components/skeleton/FilterSidebarSkeleton";

const generateSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const Products: React.FC = () => {
  const dispatch = useAppDispatch();

  const { items: products, status, error } = useAppSelector((state: RootState) => state.products);
  const searchTerm = useAppSelector((state: RootState) => state.search.term);
  const filters = useAppSelector((state: RootState) => state.filters);

  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const productsPerPage = 20;

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [status, dispatch]);

  const filterProducts = () => {
    return products.filter(({ title, main_image, price }) => {
      const titleParts = title.split(" - ");
      const brand = titleParts[0].split(" ")[0];
      const color = titleParts[0].split(" ").slice(1, -2).join(" ");
      const genre = main_image.split(" - ")[0].split(" ").slice(-2).join(" ");
      const priceValue = parseFloat(price.replace("£", ""));

      return (
        title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filters.size.length === 0 || filters.size.some((size) => title.includes(size))) &&
        (filters.brand.length === 0 || filters.brand.some((b) => brand.toLowerCase().includes(b.toLowerCase()))) &&
        (filters.genre.length === 0 || filters.genre.some((g) => genre.toLowerCase().includes(g.toLowerCase()))) &&
        (filters.color.length === 0 || filters.color.some((c) => color.toLowerCase().includes(c.toLowerCase()))) &&
        priceValue >= filters.priceRange[0] && priceValue <= filters.priceRange[1]
      );
    });
  };

  if (status === "loading") {
    return (
      <div className="flex p-6">
        <FilterSidebarSkeleton />
        <ProductsSkeleton />
      </div>
    );
  }

  if (error) return <div className="text-red-500 p-6">{error}</div>;

  const filteredProducts = filterProducts();
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  return (
    <div className="flex p-6">
      <button
        onClick={() => setShowFiltersModal(true)}
        className="fixed bottom-4 right-4 p-3 bg-[#F4EBD0] rounded-full shadow-lg lg:hidden z-50"
      >
        <IoFilter className="text-2xl" />
      </button>

      <FilterSidebar showFiltersModal={showFiltersModal} setShowFiltersModal={setShowFiltersModal} />

      <div className="w-full lg:w-3/4 pl-6">
        <h1 className="text-2xl font-bold mb-6">Product List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product, index) => (
            <div
              key={product.id}
              className="border p-4 rounded-lg shadow-sm text-center relative transition-transform duration-300 hover:scale-105 hover:shadow-lg"
              onMouseEnter={() => setHoveredProduct(index)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Link href={`/products/${generateSlug(product.title)}`}>
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={product.background_image}
                    alt={product.title}
                    width={200}
                    height={200}
                    className={`w-full h-48 object-contain mx-auto transition-opacity duration-300 ${hoveredProduct === index ? "opacity-100" : "opacity-0"}`}
                  />
                  <Image
                    src={product.main_image}
                    alt={product.title}
                    width={200}
                    height={200}
                    className={`w-full h-48 object-contain mx-auto absolute top-0 left-0 transition-opacity duration-300 ${hoveredProduct === index ? "opacity-0" : "opacity-100"}`}
                  />
                </div>
                <h3 className="text-lg font-semibold mt-2 text-gray-800">{product.title}</h3>
                <p className="text-gray-600 font-medium">{product.price}</p>
              </Link>
            
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">{currentPage} / {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;