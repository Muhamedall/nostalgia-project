"use client";
import React from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { SIZES, MARKS, GENRES } from "../constants/filters";
import { useState } from "react";
// In filtersidebar.tsx
interface FilterSidebarProps {
    showFiltersModal: boolean;
    filters: { size: string[]; brand: string[]; genre: string[] };
    updateFilters: (filterType: "size" | "brand" | "genre", value: string) => void;
  }

export default function FilterSidebar({ showFiltersModal, filters, updateFilters }: FilterSidebarProps) {
  const [showFilters, setShowFilters] = useState<{ [key: string]: boolean }>({
    size: true,
    brand: true,
    genre: true,
  });

  const toggleFilter = (filterKey: string) => {
    setShowFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  return (
    <>
      {/* Left Sidebar for Filters (Desktop) */}
      <div className="hidden lg:block w-1/4 h-[50%] p-4 bg-[#F4EBD0] rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Filters</h2>

        {/* Size Filter */}
        <div className="mb-6 bg-white p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Size</h3>
            <span onClick={() => toggleFilter("size")} className="cursor-pointer">
              {showFilters.size ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
            </span>
          </div>
          {showFilters.size && (
            <div className="space-y-2 mt-2 overflow-auto overscroll-contain max-h-40">
              {SIZES.map((size, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.size.includes(size)}
                    onChange={() => updateFilters("size", size)}
                    className="mr-2"
                  />
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
            <span onClick={() => toggleFilter("brand")} className="cursor-pointer">
              {showFilters.brand ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
            </span>
          </div>
          {showFilters.brand && (
            <div className="space-y-2 mt-2 overflow-auto overscroll-contain max-h-40">
              {MARKS.map((brand, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.brand.includes(brand)}
                    onChange={() => updateFilters("brand", brand)}
                    className="mr-2"
                  />
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
            <span onClick={() => toggleFilter("genre")} className="cursor-pointer">
              {showFilters.genre ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
            </span>
          </div>
          {showFilters.genre && (
            <div className="space-y-2 mt-2 overflow-auto overscroll-contain max-h-40">
              {GENRES.map((genre, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.genre.includes(genre)}
                    onChange={() => updateFilters("genre", genre)}
                    className="mr-2"
                  />
                  {genre}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}