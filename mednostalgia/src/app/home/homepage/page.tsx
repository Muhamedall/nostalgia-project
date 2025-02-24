"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import FilterSidebar from "../FilterSiderbar";
import ProductsSkeleton from "@/components/skeleton/ProductsSkeleton";
import FilterSidebarSkeleton from "@/components/skeleton/FilterSidebarSkeleton";
import { IoFilter } from "react-icons/io5";

interface Product {
  id: number;
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
  const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({
    size: [],
    brand: [],
    genre: [],
    color: [],
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const productsPerPage = 20;

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

  const handleFilterChange = (newFilters: { [key: string]: string[] }) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePriceChange = (newPriceRange: [number, number]) => {
    setPriceRange(newPriceRange);
    setCurrentPage(1); // Reset to first page when price range changes
  };

  // Extract available sizes, brands, genres, and colors from the products
  const extractFilters = (products: Product[]) => {
    const sizes = new Set<string>();
    const brands = new Set<string>();
    const genres = new Set<string>();
    const colors = new Set<string>();

    products.forEach((product) => {
      // Extract size from title (e.g., "MEDIUM WASH DENIM DUNGAREES - 6-9 MONTHS")
      const sizeMatch = product.title.match(/- (\d+-\d+ MONTHS|W\d+ L\d+|[SMLXL]+)/);
      if (sizeMatch) sizes.add(sizeMatch[1]);

      // Extract brand from title (e.g., "LEVI'S LIGHT WASH DENIM JACKET - XL")
      const brandMatch = product.title.match(/^(.*?) -/);
      if (brandMatch) brands.add(brandMatch[1]);

      // Extract genre from title (e.g., "MEDIUM WASH DENIM DUNGAREES")
      const genreMatch = product.title.match(/^(.*?) -/);
      if (genreMatch) genres.add(genreMatch[1]);

      // Extract color from title (e.g., "LIGHT WASH DENIM JACKET")
      const colorMatch = product.title.match(/(LIGHT|MEDIUM|DARK|BLACK|BLUE|RED|GREEN|YELLOW|BROWN|GREY|NAVY|PINK|WHITE)/);
      if (colorMatch) colors.add(colorMatch[1]);
    });

    return {
      sizes: Array.from(sizes),
      brands: Array.from(brands),
      genres: Array.from(genres),
      colors: Array.from(colors),
    };
  };

  const { sizes, brands, genres, colors } = extractFilters(products);

  const filterProducts = (products: Product[]) => {
    return products.filter((product) => {
      // Filter by size
      const matchesSize =
        filters.size.length === 0 ||
        filters.size.some((size) => product.title.includes(size));

      // Filter by brand
      const matchesBrand =
        filters.brand.length === 0 ||
        filters.brand.some((brand) => product.title.includes(brand));

      // Filter by genre
      const matchesGenre =
        filters.genre.length === 0 ||
        filters.genre.some((genre) => product.title.includes(genre));

      // Filter by color
      const matchesColor =
        filters.color.length === 0 ||
        filters.color.some((color) => product.title.includes(color));

      // Filter by price
      const price = parseFloat(product.price.replace("£", ""));
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

      return matchesSize && matchesBrand && matchesGenre && matchesColor && matchesPrice;
    });
  };

  const filteredProducts = filterProducts(products);

  if (loading) {
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
        onFilterChange={handleFilterChange}
        onPriceChange={handlePriceChange}
        sizes={sizes}
        brands={brands}
        genres={genres}
        colors={colors}
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