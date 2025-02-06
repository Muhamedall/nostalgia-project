"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MdFavoriteBorder } from "react-icons/md";
import { CiShoppingCart } from "react-icons/ci";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FaSearch } from "react-icons/fa";
import { CgMenuGridO } from "react-icons/cg";
import { HiUserCircle } from "react-icons/hi";
import LoginPage from "@/app/auth/login/page";
import SignUpPage from "@/app/auth/register/page";

export default function Navbar() {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Sign Up

  const toggleForm = () => {
    setIsLogin((prev) => !prev); // Toggle between Login and Sign Up
  };

  return (
    <nav className="flex flex-col md:flex-row items-center justify-between px-4 py-4 bg-white shadow-md">
      {/* Logo Section */}
      <div className="flex flex-col items-center md:flex-row md:space-x-6">
        <Link href="/" className="text-xl font-bold text-gray-800">
          Mednostalgia
        </Link>
      </div>

      {/* Search Bar and Icons for Mobile */}
      <div className="flex flex-col w-full md:hidden items-center mt-4">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center space-x-6 w-full">
        {/* Full-Width Search Bar */}
        <div className="relative flex-1 ml-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button aria-label="Search" className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-600 hover:text-gray-900">
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
        

        {/* Login Button with Popup */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-blue-600 text-white">Login</Button>
          </SheetTrigger>
          <SheetContent side="right" className="overflow-auto w-full max-w-md">
            <SheetHeader>
              <SheetTitle className="text-center">
              
              </SheetTitle>
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
      </div>
    </nav>
  );
}