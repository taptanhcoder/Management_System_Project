"use client";

import { useEffect, useState, useRef } from "react";
import { Search } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
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
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
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
          placeholder="Search for anything here.."
          className="bg-transparent w-full focus:outline-none text-sm text-gray-800 dark:text-white"
        />
        <Search size={16} className="text-gray-500 dark:text-gray-400" />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-6">
        {/* Date & Time */}
        <div className="flex items-center gap-2 text-sm">
          <div className="text-right">
            <div className="font-semibold text-gray-800 dark:text-white">Water</div>
            <div className="text-xs text-gray-500">
              {formattedDate} • {currentTime}
            </div>
          </div>
        </div>

        {/* Notification */}
        <div className="relative cursor-pointer">
          <Image src="/notification.png" alt="Notification" width={22} height={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            1
          </span>
        </div>

        {/* Avatar */}
        <div className="relative" ref={dropdownRef}>
          <Image
            src="/avatar.png"
            alt="User"
            width={36}
            height={36}
            className="rounded-full cursor-pointer border border-gray-300 dark:border-gray-600"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 z-50">
              <a
                href="/profile"
                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
              >
                My Profile
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
              >
                Settings
              </a>
              <a
                href="/logout"
                className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-600"
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
