"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import FilterSidebar from "../FilterSiderbar";
import ProductsSkeleton from "@/components/skeleton/ProductsSkeleton";
import FilterSidebarSkeleton from "@/components/skeleton/FilterSidebarSkeleton";
import { IoFilter } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/lib/features/productsSlice";
import { RootState } from "@/lib/store";




const Products: React.FC = () => {
  

  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.items);
  const searchTerm = useSelector((state: RootState) => state.search.term);
  const status = useSelector((state: RootState) => state.products.status);
  const error = useSelector((state: RootState) => state.products.error);
  const filters = useSelector((state: RootState) => state.filters);
  const [hoveredProductIndex, setHoveredProductIndex] = useState<number | null>(null);
  const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const productsPerPage = 20;


  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts()); 
    }
  }, [status, dispatch]);

  const filterProducts = (products: typeof products) => {
    return products.filter((product) => {
      
      const titleParts = product.title.split(" - ");
      const brand = titleParts[0].split(" ")[0]; // First word is the brand
      const color = titleParts[0].split(" ").slice(1, -2).join(" "); // Middle words are the color
      const imageParts =product.main_image.split(" - ");
      const genre = imageParts[0].split(" ").slice(-2).join(" "); // Last two words are the genre

      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
      // Filter by size
      const matchesSize =
        filters.size.length === 0 ||
        filters.size.some((size) => product.title.includes(size));

      // Filter by brand
      const matchesBrand =
      filters.brand.length === 0 ||
      filters.brand.some((filterBrand) => brand.toLowerCase().includes(filterBrand.toLowerCase()));
      const matchesGenre =
      filters.genre.length === 0 ||
      filters.genre.some((filterGenre) => genre.toLowerCase().includes(filterGenre.toLowerCase()));
      // Filter by color
      const matchesColor =
      filters.color.length === 0 ||
      filters.color.some((filterColor) => color.toLowerCase().includes(filterColor.toLowerCase()));


      // Filter by price
      const price = parseFloat(product.price.replace("£", ""));
      const matchesPrice = price >= filters.priceRange[0] && price <= filters.priceRange[1];


      return  matchesSearch && matchesSize && matchesBrand && matchesGenre && matchesColor && matchesPrice  ;
    });
  };

  const filteredProducts = filterProducts(products);

  if (status === 'loading') {
    return (
      <div className="flex p-6">
        <FilterSidebarSkeleton />
        <ProductsSkeleton />
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="flex p-6">
      <button
        onClick={() => setShowFiltersModal(true)}
        className="fixed bottom-4 right-4 p-3 bg-[#F4EBD0] rounded-full shadow-lg lg:hidden z-50"
      >
        <IoFilter className="text-2xl" />
      </button>

      <FilterSidebar
        showFiltersModal={showFiltersModal}
        setShowFiltersModal={setShowFiltersModal}
      />

      <div className="w-full lg:w-3/4 pl-6">
        <h1 className="text-2xl font-bold mb-6">Product List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentProducts.map((product, index) => (
            <div
              key={product.id}
              className="border p-4 rounded-lg shadow-sm text-center relative transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
              onMouseEnter={() => setHoveredProductIndex(index)}
              onMouseLeave={() => setHoveredProductIndex(null)}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={product.background_image}
                  alt={product.title}
                  width={200}
                  height={200}
                  className="w-full h-48 object-contain mx-auto transition-opacity duration-300"
                  style={{ opacity: hoveredProductIndex === index ? 1 : 0 }}
                />
                <Image
                  src={product.main_image}
                  alt={product.title}
                  width={200}
                  height={200}
                  className="w-full h-48 object-contain mx-auto absolute top-0 left-0 transition-opacity duration-300"
                  style={{ opacity: hoveredProductIndex === index ? 0 : 1 }}
                />
              </div>
              <h3 className="text-lg font-semibold mt-2 text-gray-800">{product.title}</h3>
              <p className="text-gray-600 font-medium">{product.price}</p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300">
                Add to Cart
              </button>
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