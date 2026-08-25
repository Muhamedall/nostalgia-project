"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/features/authSlice";
import { MdFavoriteBorder, MdNotifications } from "react-icons/md";
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
import { FaSearch } from "react-icons/fa";
import { HiUserCircle } from "react-icons/hi";
import LoginPage from "@/app/auth/login/page";
import SignUpPage from "@/app/auth/register/page";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { RootState } from "@/lib/store";
import Image from "next/image";
import { setSearchTerm } from '@/lib/features/searchSlice';

export default function Navbar() {
  const [isLogin, setIsLogin] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const menuRef = useRef<HTMLDivElement>(null);
  const handelLogout = () => {
    dispatch(logoutUser());
    closeMenu();
  };
  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  const toggleMenu = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const closeMenu = () => {
    setActiveMenu(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value));
  };

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <NavbarSkeleton />;
  }

  // Menu card content based on active menu
  const renderMenuContent = () => {
    switch (activeMenu) {
      case 'notifications':
        return (
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2">Notifications</h3>
            <p>No new notifications</p>
          </div>
        );
      case 'user':
        return (
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2"> Profile</h3>
            <p>Welcome, {user?.name || 'User'}!</p>
            <div className="mt-4 space-y-2">
              <Link href="/profile" className="block hover:bg-gray-100 p-2 rounded">My Profile</Link>
              <Link href="/orders" className="block hover:bg-gray-100 p-2 rounded">My Orders</Link>
              <button onClick={handelLogout} className="block hover:bg-gray-100 p-2 rounded w-full text-left">Logout</button>
            </div>
          </div>
        );
      case 'login':
        return (
          <div className="p-4">
            {isLogin ? (
              <LoginPage toggleForm={toggleForm} />
            ) : (
              <SignUpPage toggleForm={toggleForm} />
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="flex flex-col md:flex-row items-center justify-between px-4 py-4 bg-white shadow-md">
      {/* Logo Section */}
      <div className="flex flex-col items-center md:flex-row md:space-x-6">
        <Link href="/" className="text-xl font-bold text-gray-800">
          <Image 
            src={Logo} 
            alt="Logo"
            width={90}
            height={60}
            priority
          />
        </Link>
      </div>

      {/* Search Bar and Icons for Mobile */}
      <div className="flex flex-col w-full md:hidden items-center mt-4">
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

          {user ? (
            <>
              <button 
                onClick={() => toggleMenu('notifications')}
                className="text-gray-600 hover:text-gray-900 relative"
              >
                <MdNotifications size={28} />
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                  3
                </span>
              </button>

              <button 
                onClick={() => toggleMenu('user')}
                className="text-gray-600 hover:text-gray-900"
              >
                <HiUserCircle size={30} />
              </button>
            </>
          ) : (
            <button 
              onClick={() => toggleMenu('login')}
              className="text-gray-600 hover:text-gray-900"
            >
              <HiUserCircle size={28} />
            </button>
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
            onChange={handleSearchChange}
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

        {user ? (
          <>
            <button 
              onClick={() => toggleMenu('notifications')}
              className="text-gray-600 hover:text-gray-900 relative"
            >
              <MdNotifications size={28} />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                3
              </span>
            </button>

            <button 
              onClick={() => toggleMenu('user')}
              className="text-gray-600 hover:text-gray-900"
            >
              <HiUserCircle size={30} />
            </button>
          </>
        ) : (
          <button 
            onClick={() => toggleMenu('login')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        )}
      </div>

      {/* Menu Card (appears when activeMenu is set) */}
      {activeMenu && (
        <div 
          ref={menuRef}
          className="absolute right-4 top-20 md:top-16 bg-white shadow-lg rounded-md z-50 w-64"
        >
          {renderMenuContent()}
        </div>
      )}
    </nav>
  );
}