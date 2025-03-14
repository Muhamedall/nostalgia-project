"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MdFavoriteBorder, MdNotifications } from "react-icons/md"; // Import MdNotifications
import { CiShoppingCart } from "react-icons/ci";
import Logo from '../../../public/logo.png';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import NavbarSkeleton from "../skeleton/SkeletonNavbar";
import { FaSearch } from "react-icons/fa"; // Import FaTimes for the close icon
import { HiUserCircle } from "react-icons/hi";
import LoginPage from "@/app/auth/login/page";
import SignUpPage from "@/app/auth/register/page";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { RootState } from "@/lib/store"; // Adjust the path to your store
import Image from "next/image";
import { setSearchTerm } from '@/lib/features/searchSlice';


export default function Navbar() {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Sign Up
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user); // Get the user from Redux store
  const menuRef = useRef<HTMLDivElement>(null); // Ref for the dropdown menu

  const toggleForm = () => {
    setIsLogin((prev) => !prev); // Toggle between Login and Sign Up
  };



 
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    dispatch(setSearchTerm(event.target.value));
  };


  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <NavbarSkeleton />;
  }

  return (
    <nav className="flex flex-col md:flex-row items-center justify-between px-4 py-4 bg-white shadow-md">
      {/* Logo Section */}
      <div className="flex flex-col items-center md:flex-row md:space-x-6">
      <Link href="/" className="text-xl font-bold text-gray-800">
    <Image 
      src={Logo} 
      alt="Logo"
      width={90} // Adjust width as needed
      height={60}  // Adjust height as needed
      priority // Ensures the image loads quickly
    />
  </Link>
      </div>

      {/* Search Bar and Icons for Mobile */}
      <div className=" flex flex-col w-full md:hidden items-center mt-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleSearchChange}
          />
          <button aria-label="Search" className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-600 hover:text-gray-900">
            <FaSearch size={18} />
          </button>
        </div>
        <div className="flex space-x-4 mt-4">
          <Link href="/wishlist" aria-label="Wishlist" className="text-gray-600 hover:text-gray-900">
            <MdFavoriteBorder size={28} />
          </Link>
          <Link href="/products" aria-label="Cart" className="text-gray-600 hover:text-gray-900">
            <CiShoppingCart size={28} />
          </Link>

          {/* Mobile: Show user icon and dropdown menu if logged in, otherwise show login/signup sheet */}
          {user ? (
            <>
              {/* Notification Icon */}
              <button  className="text-gray-600 hover:text-gray-900 relative" >
                <MdNotifications size={28} />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                  3 
                </span>
              </button>

              <button  className="text-gray-600 hover:text-gray-900">
                <HiUserCircle size={30} />
              </button>
            </>
          ) : (
            <Sheet>
              <SheetTrigger aria-label="">
                <HiUserCircle size={28} className="text-gray-600 hover:text-gray-900" />
              </SheetTrigger>
              <SheetContent side="right" className="overflow-auto w-full max-w-md">
                <SheetHeader>
                  <SheetTitle></SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  {isLogin ? (
                    <LoginPage toggleForm={toggleForm} />
                  ) : (
                    <SignUpPage toggleForm={toggleForm} />
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="  hidden md:flex items-center space-x-6 w-full">
        {/* Full-Width Search Bar */}
        <div className="relative flex-1 ml-4">
          <input
         
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleSearchChange}
           
          />
          <button aria-label="Search" className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-600 hover:text-gray-900" >
            <FaSearch size={18} />
          </button>
        </div>

        {/* Navigation Links */}
        <Link href="/wishlist" aria-label="Wishlist" className="text-gray-600 hover:text-gray-900">
          <MdFavoriteBorder size={30} />
        </Link>
        <Link href="/products" aria-label="Cart" className="text-gray-600 hover:text-gray-900">
          <CiShoppingCart size={30} />
        </Link>

        {/* Conditional Rendering for Login Button or User Menu */}
        {user ? (
          <>
            {/* Notification Icon */}
            <button className="text-gray-600 hover:text-gray-900 relative" >
              <MdNotifications size={28} />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                3 {/* Replace with actual notification count */}
              </span>
            </button>

            <button  className="text-gray-600 hover:text-gray-900">
              <HiUserCircle size={30} />
            </button>
          </>
        ) : (
          <Sheet>
            <SheetTrigger asChild>
              <Button className="bg-blue-600 text-white">Login</Button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-auto w-full max-w-md">
              <SheetHeader>
                <SheetTitle className="text-center"></SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                {isLogin ? (
                  <LoginPage toggleForm={toggleForm} />
                ) : (
                  <SignUpPage toggleForm={toggleForm} />
                )}
              </div>
            </SheetContent>
          </Sheet>
        )}

      </div>
      
        
    </nav>
  );
}