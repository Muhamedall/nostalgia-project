"use client";
import { useState, useRef, useEffect } from "react";
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
import { FaSearch, FaTimes } from "react-icons/fa"; // Import FaTimes for the close icon
import { HiUserCircle } from "react-icons/hi";
import LoginPage from "@/app/auth/login/page";
import SignUpPage from "@/app/auth/register/page";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // Adjust the path to your store
import { logoutUser } from "@/redux/features/authSlice"; // Adjust the path to your auth slice

export default function Navbar() {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Sign Up
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user); // Get the user from Redux store
  const menuRef = useRef<HTMLDivElement>(null); // Ref for the dropdown menu

  const toggleForm = () => {
    setIsLogin((prev) => !prev); // Toggle between Login and Sign Up
  };

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatch logout action
    setIsMenuOpen(false); // Close the menu after logout
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev); // Toggle menu visibility
  };

  const closeMenu = () => {
    setIsMenuOpen(false); // Close the menu
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

          {/* Mobile: Show user icon and dropdown menu if logged in, otherwise show login/signup sheet */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={toggleMenu}
                className="text-gray-600 hover:text-gray-900"
              >
                <HiUserCircle size={28} />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute  right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                  {/* Close button */}
                  <button
                    onClick={closeMenu}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                  >
                    <FaTimes size={16} />
                  </button>

                  {/* Menu Items */}
                  <Link
                    href="/account"
                    onClick={closeMenu}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Account
                  </Link>
                  <Link
                    href="/messages"
                    onClick={closeMenu}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Messages
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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

        {/* Conditional Rendering for Login Button or User Menu */}
        {user ? (
          <div className="relative" ref={menuRef}>
            {/* Button to toggle the menu */}
            <button
              onClick={toggleMenu}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <HiUserCircle size={30} />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                {/* Close button */}
                <button
                  onClick={closeMenu}
                  className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                >
                  <FaTimes size={16} />
                </button>

                {/* Menu Items */}
                <Link
                  href="/account"
                  onClick={closeMenu}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Account
                </Link>
                <Link
                  href="/messages"
                  onClick={closeMenu}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Messages
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
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