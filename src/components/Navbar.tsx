// src/components/Navbar.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface NavbarProps {
  onLogout: () => void;
  userName: string;
}

const Navbar = ({ onLogout, userName }: NavbarProps) => {
  const [currentTime, setCurrentTime] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(time);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formattedDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      {/* Search bar */}
      <div className="flex items-center w-full max-w-md bg-gray-100 dark:bg-gray-800 rounded-md px-3 py-2">
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent w-full focus:outline-none text-sm text-gray-800 dark:text-white"
        />
        <Search size={18} className="text-gray-500 dark:text-gray-400" />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-6">
        {/* User & Time */}
        <div className="flex items-center gap-2 text-sm">
          <div className="text-right">
            <p className="font-semibold text-gray-800 dark:text-white">
              {userName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formattedDate} • {currentTime}
            </p>
          </div>
        </div>

        {/* Notification Icon */}
        <button className="relative focus:outline-none">
          <Bell size={22} className="text-gray-600 dark:text-gray-300" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </button>

        {/* Avatar & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-1 focus:outline-none">
            <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <span className="text-gray-700 dark:text-gray-200">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <ChevronDown size={16} className="text-gray-600 dark:text-gray-300" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 z-50">
              <Link href="/dashboard/profile" legacyBehavior>
                <a className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  My Profile
                </a>
              </Link>
              <Link href="/dashboard/settings" legacyBehavior>
                <a className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Settings
                </a>
              </Link>
              <button
                onClick={onLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
