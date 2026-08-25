"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoFilter } from "react-icons/io5";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchProducts } from "@/lib/features/productsSlice";
import { RootState } from "@/lib/store";

import FilterSidebar from "../home/FilterSiderbar";
import ProductsSkeleton from "@/components/skeleton/ProductsSkeleton";
import FilterSidebarSkeleton from "@/components/skeleton/FilterSidebarSkeleton";

const Products: React.FC = () => {
  const dispatch = useAppDispatch();

  // ---------------------------------------------------------
  // Redux state
  // ---------------------------------------------------------

  const {
    items: products,
    status,
    error,
  } = useAppSelector(
    (state: RootState) => state.products
  );

  const searchTerm = useAppSelector(
    (state: RootState) => state.search.term
  );

  const filters = useAppSelector(
    (state: RootState) => state.filters
  );

  // ---------------------------------------------------------
  // Local state
  // ---------------------------------------------------------

  const [hoveredProduct, setHoveredProduct] =
    useState<number | null>(null);

  const [showFiltersModal, setShowFiltersModal] =
    useState<boolean>(false);

  const [currentPage, setCurrentPage] =
    useState<number>(1);

  const productsPerPage = 20;

  // ---------------------------------------------------------
  // Make sure products is ALWAYS an array
  // ---------------------------------------------------------

  const safeProducts = Array.isArray(products)
    ? products
    : [];

  // ---------------------------------------------------------
  // Fetch products
  // ---------------------------------------------------------

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // ---------------------------------------------------------
  // Filter products
  // ---------------------------------------------------------

  const filteredProducts = useMemo(() => {
    return safeProducts.filter((product) => {

      // -----------------------------------------------------
      // Safe values
      // -----------------------------------------------------

      const title = product.title ?? "";

      const mainImage =
        product.main_image ?? "";

      const price =
        product.price ?? "0";

      // -----------------------------------------------------
      // Search
      // -----------------------------------------------------

      const normalizedTitle =
        title.toLowerCase();

      const normalizedSearch =
        searchTerm.toLowerCase();

      // -----------------------------------------------------
      // Old filtering logic
      // -----------------------------------------------------

      const titleParts =
        title.split(" - ");

      const brand =
        titleParts[0]
          ?.split(" ")[0] ?? "";

      const color =
        titleParts[0]
          ?.split(" ")
          .slice(1, -2)
          .join(" ") ?? "";

      const genre =
        mainImage
          .split(" - ")
          .slice(-2)
          .join(" ");

      // -----------------------------------------------------
      // Price
      // -----------------------------------------------------

      const priceValue =
        parseFloat(
          price
            .replace(/[£$€,]/g, "")
            .trim()
        ) || 0;

      // -----------------------------------------------------
      // Search filter
      // -----------------------------------------------------

      const matchesSearch =
        normalizedTitle.includes(
          normalizedSearch
        );

      // -----------------------------------------------------
      // Size filter
      // -----------------------------------------------------

      const matchesSize =
        filters.size.length === 0 ||
        filters.size.some((size) =>
          title
            .toLowerCase()
            .includes(size.toLowerCase())
        );

      // -----------------------------------------------------
      // Brand filter
      // -----------------------------------------------------

      const matchesBrand =
        filters.brand.length === 0 ||
        filters.brand.some((brandFilter) =>
          brand
            .toLowerCase()
            .includes(
              brandFilter.toLowerCase()
            )
        );

      // -----------------------------------------------------
      // Genre filter
      // -----------------------------------------------------

      const matchesGenre =
        filters.genre.length === 0 ||
        filters.genre.some((genreFilter) =>
          genre
            .toLowerCase()
            .includes(
              genreFilter.toLowerCase()
            )
        );

      // -----------------------------------------------------
      // Color filter
      // -----------------------------------------------------

      const matchesColor =
        filters.color.length === 0 ||
        filters.color.some((colorFilter) =>
          color
            .toLowerCase()
            .includes(
              colorFilter.toLowerCase()
            )
        );

      // -----------------------------------------------------
      // Price filter
      // -----------------------------------------------------

      const matchesPrice =
        priceValue >=
          filters.priceRange[0] &&
        priceValue <=
          filters.priceRange[1];

      // -----------------------------------------------------
      // Final result
      // -----------------------------------------------------

      return (
        matchesSearch &&
        matchesSize &&
        matchesBrand &&
        matchesGenre &&
        matchesColor &&
        matchesPrice
      );
    });
  }, [
    safeProducts,
    searchTerm,
    filters,
  ]);

  // ---------------------------------------------------------
  // Reset page when filters/search change
  // ---------------------------------------------------------

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  // ---------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length /
        productsPerPage
    )
  );

  const currentProducts =
    filteredProducts.slice(
      (currentPage - 1) *
        productsPerPage,

      currentPage *
        productsPerPage
    );

  // ---------------------------------------------------------
  // Loading
  // ---------------------------------------------------------

  if (status === "loading") {
    return (
      <div className="flex p-6">
        <FilterSidebarSkeleton />

        <ProductsSkeleton />
      </div>
    );
  }

  // ---------------------------------------------------------
  // Error
  // ---------------------------------------------------------

  if (status === "failed") {
    return (
      <div className="text-red-500 p-6">
        {error || "Failed to load products."}
      </div>
    );
  }

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------

  return (
    <div className="flex p-6">

      {/* ---------------------------------------------------
          Mobile filter button
      --------------------------------------------------- */}

      <button
        onClick={() =>
          setShowFiltersModal(true)
        }
        className="
          fixed
          bottom-4
          right-4
          p-3
          bg-[#F4EBD0]
          rounded-full
          shadow-lg
          lg:hidden
          z-50
        "
        aria-label="Open filters"
      >
        <IoFilter className="text-2xl" />
      </button>

      {/* ---------------------------------------------------
          Sidebar
      --------------------------------------------------- */}

      <FilterSidebar
        showFiltersModal={
          showFiltersModal
        }
        setShowFiltersModal={
          setShowFiltersModal
        }
      />

      {/* ---------------------------------------------------
          Products container
      --------------------------------------------------- */}

      <div className="w-full lg:w-3/4 pl-6">

        <h1 className="text-2xl font-bold mb-6">
          Product List
        </h1>

        {/* -------------------------------------------------
            Empty state
        ------------------------------------------------- */}

        {currentProducts.length === 0 ? (

          <div className="flex flex-col items-center justify-center py-20">

            <h2 className="text-xl font-semibold text-gray-700">
              No products found
            </h2>

            <p className="text-gray-500 mt-2">
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          /* -------------------------------------------------
             Product grid
          ------------------------------------------------- */

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              gap-6
            "
          >

            {currentProducts.map(
              (product, index) => {

                // -----------------------------------------
                // Safe image URLs
                // -----------------------------------------

                const mainImage =
                  product.main_image ||
                  "/placeholder-product.png";

                const backgroundImage =
                  product.background_image ||
                  mainImage;

                return (

                  <div
                    key={product.id}
                    className="
                      border
                      p-4
                      rounded-lg
                      shadow-sm
                      text-center
                      relative
                      transition-transform
                      duration-300
                      hover:scale-105
                      hover:shadow-lg
                    "
                    onMouseEnter={() =>
                      setHoveredProduct(index)
                    }
                    onMouseLeave={() =>
                      setHoveredProduct(null)
                    }
                  >

                    <Link
                      href={`/products/${product.id}`}
                    >

                      {/* ---------------------------------
                          Images
                      --------------------------------- */}

                      <div className="relative h-48 overflow-hidden">

                        {/* Background / hover image */}

                        <Image
                          src={backgroundImage}
                          alt={product.title}
                          width={200}
                          height={200}
                          className={`
                            w-full
                            h-48
                            object-contain
                            mx-auto
                            transition-opacity
                            duration-300
                            ${
                              hoveredProduct === index
                                ? "opacity-100"
                                : "opacity-0"
                            }
                          `}
                        />

                        {/* Main image */}

                        <Image
                          src={mainImage}
                          alt={product.title}
                          width={200}
                          height={200}
                          className={`
                            w-full
                            h-48
                            object-contain
                            mx-auto
                            absolute
                            top-0
                            left-0
                            transition-opacity
                            duration-300
                            ${
                              hoveredProduct === index
                                ? "opacity-0"
                                : "opacity-100"
                            }
                          `}
                        />

                      </div>

                      {/* ---------------------------------
                          Product title
                      --------------------------------- */}

                      <h3
                        className="
                          text-lg
                          font-semibold
                          mt-2
                          text-gray-800
                        "
                      >
                        {product.title}
                      </h3>

                      {/* ---------------------------------
                          Price
                      --------------------------------- */}

                      <p
                        className="
                          text-gray-600
                          font-medium
                        "
                      >
                        {product.price}
                      </p>

                    </Link>

                  </div>
                );
              }
            )}

          </div>
        )}

        {/* -------------------------------------------------
            Pagination
        ------------------------------------------------- */}

        {filteredProducts.length > 0 && (

          <div
            className="
              flex
              justify-center
              items-center
              mt-6
              space-x-2
            "
          >

            {/* Previous */}

            <button
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.max(
                      prev - 1,
                      1
                    )
                )
              }
              disabled={
                currentPage === 1
              }
              className="
                px-4
                py-2
                bg-gray-200
                rounded
                disabled:opacity-50
              "
            >
              Previous
            </button>

            {/* Page */}

            <span className="px-4 py-2">
              {currentPage} / {totalPages}
            </span>

            {/* Next */}

            <button
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    Math.min(
                      prev + 1,
                      totalPages
                    )
                )
              }
              disabled={
                currentPage === totalPages
              }
              className="
                px-4
                py-2
                bg-gray-200
                rounded
                disabled:opacity-50
              "
            >
              Next
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default Products;