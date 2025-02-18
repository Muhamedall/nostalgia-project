"use client";
import React ,{useState , useEffect} from "react";
import { IoMdArrowDropdown, IoMdArrowDropup} from "react-icons/io";
import { SIZES, MARKS, GENRES } from "../constants/filters"; // Import filter data
import FilterSidebarSkeleton from "@/components/skeleton/FilterSidebarSkeleton";
// Define the Props Type
interface FilterSidebarProps {
  showFiltersModal: boolean ;
  //toggleFilter: (filterKey: string) => void;
  setShowFiltersModal : (filterKey: boolean) =>void;
}
const FilterSidebar: React.FC<FilterSidebarProps> = ({ showFiltersModal , setShowFiltersModal}) => {
 // Toggle visibility for a specific filter section
  // Single state to manage visibility of all filter sections
  const [showFilters, setShowFilters] = useState<{ [key: string]: boolean }>({
    size: true,
    brand: true,
    genre: true,
  });
  
  const [loading , setLoading]=useState(true)
  
   const toggleFilter = (filterKey: string) => {
     setShowFilters((prev) => ({
       ...prev,
       [filterKey]: !prev[filterKey],
     }));
   };
   useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <FilterSidebarSkeleton />;
  }

  return (
    <>
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
    
    </>
  );
}
export default FilterSidebar;