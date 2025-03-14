// FilterSidebar.tsx
"use client";
import React, { useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { SIZES, MARKS, GENRES, COLORS, CATEGORIES } from "../constants/filters";
import { setFilters, setPriceRange } from "@/lib/features/filtersSlice";
import { RootState } from "@/lib/store";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';

interface FilterSidebarProps {
  showFiltersModal: boolean;
  setShowFiltersModal: (filterKey: boolean) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ showFiltersModal, setShowFiltersModal }) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state: RootState) => state.filters);
  const [showFilters, setShowFilters] = useState<{ [key: string]: boolean }>({
    size: true,
    brand: true,
    genre: true,
    categorie: true,
    color: true,
  });

  const toggleFilter = (filterKey: string) => {
    setShowFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  const handleFilterChange = (filterKey: keyof typeof filters, value: string) => {
    const currentFilters = filters[filterKey]; // Get the current filters for the key
    const updatedFilters = currentFilters.includes(value)
      ? currentFilters.filter((item) => item !== value) // Remove the value if it exists
      : [...currentFilters, value]; // Add the value if it doesn't exist
  
    // Dispatch the updated filters
    dispatch(setFilters({ key: filterKey, value: updatedFilters }));
  };

  const handlePriceChange = (newPriceRange: [number, number]) => {
    dispatch(setPriceRange(newPriceRange));
  };

  return (
    <>
      {/* Left Sidebar for Filters (Desktop) */}
      <div className="hidden lg:block w-1/4 h-[50%] p-4 bg-[#F4EBD0] rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Filters</h2>

       {/* Price Filter */}
<div className="mb-6 bg-white p-4 rounded-lg">
  <h3 className="font-semibold mb-2">Price $</h3>
  <input
    type="range"
    min="0"
    max="1000"
    className="w-full"
    value={filters.priceRange[1]}
    onChange={(e) => handlePriceChange([filters.priceRange[0], parseInt(e.target.value)])}
  />
  {/* Display the selected price */}
  <p className="text-sm text-gray-600 mt-2">
    Selected Price: ${filters.priceRange[1]}
  </p>
</div>

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
                    className="mr-2"
                    checked={filters.size.includes(size)}
                    onChange={() => handleFilterChange("size", size)}
                  />
                  {size}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Categories Filter */}
        <div className="mb-6 bg-white p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Categories</h3>
            <span onClick={() => toggleFilter("categorie")} className="cursor-pointer">
              {showFilters.categorie ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
            </span>
          </div>
          {showFilters.categorie && (
            <div className="space-y-2 mt-2 overflow-auto overscroll-contain max-h-40">
              {CATEGORIES.map((categorie, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={filters.size.includes(categorie)}
                    onChange={() => handleFilterChange("size", categorie)}
                  />
                  {categorie}
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
                    className="mr-2"
                    checked={filters.brand.includes(brand)}
                    onChange={() => handleFilterChange("brand", brand)}
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
                    className="mr-2"
                    checked={filters.genre.includes(genre)}
                    onChange={() => handleFilterChange("genre", genre)}
                  />
                  {genre}
                </label>
              ))}
            </div>
          )}
        </div>

     {/* Color Filter */}
<div className="mb-6 bg-white p-4 rounded-lg">
  <div className="flex justify-between items-center">
    <h3 className="font-semibold">Color</h3>
    <span onClick={() => toggleFilter("color")} className="cursor-pointer">
      {showFilters.color ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
    </span>
  </div>
  {showFilters.color && (
    <div className="grid grid-cols-4 gap-2 mt-2">
      {COLORS.map((color, index) => (
        <label key={index} className="flex flex-col items-center">
          <input
            type="checkbox"
            className="hidden"
            checked={filters.color.includes(color)}
            onChange={() => handleFilterChange("color", color)}
          />
          <div
            className={`w-8 h-8 rounded-full border-2 cursor-pointer relative ${
              filters.color.includes(color)
                ? "ring-4 ring-offset-2 ring-black" // Ring effect for selected color
                : "border-gray-300"
            }`}
            style={{ backgroundColor: color.toLowerCase() }}
          ></div>
          <span className="text-xs mt-1">{color}</span>
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
              <input
                type="range"
                min="0"
                max="1000"
                className="w-full"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceChange([filters.priceRange[0], parseInt(e.target.value)])}
              />
            </div>

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
                        className="mr-2"
                        checked={filters.size.includes(size)}
                        onChange={() => handleFilterChange("size", size)}
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
                        className="mr-2"
                        checked={filters.brand.includes(brand)}
                        onChange={() => handleFilterChange("brand", brand)}
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
                        className="mr-2"
                        checked={filters.genre.includes(genre)}
                        onChange={() => handleFilterChange("genre", genre)}
                      />
                      {genre}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Color Filter */}
            <div className="mb-6 bg-white p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Color</h3>
                <span onClick={() => toggleFilter("color")} className="cursor-pointer">
                  {showFilters.color ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
                </span>
              </div>
              {showFilters.color && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {COLORS.map((color, index) => (
                    <label key={index} className="flex flex-col items-center">
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={filters.color.includes(color)}
                        onChange={() => handleFilterChange("color", color)}
                      />
                      <div
                        className="w-6 h-6 rounded-full border cursor-pointer"
                        style={{ backgroundColor: color.toLowerCase() }}
                      ></div>
                      <span className="text-xs mt-1">{color}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSidebar;