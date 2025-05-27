"use client";

import Image from "next/image";
import { useState } from "react";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="w-full px-4 py-3 flex items-center justify-between border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#1f2937]">
      {/* Welcome Text */}
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
        Welcome, Pharmacy Staff
      </h2>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative">
        {/* Expiration Alert Icon */}
        <div className="relative cursor-pointer">
          <Image
            src="/notification.png"
            alt="Alerts"
            width={24}
            height={24}
            className="dark:invert" // giúp icon trắng rõ hơn trong dark mode nếu cần
          />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span>
        </div>

        {/* User Avatar */}
        <div className="relative">
          <Image
            src="/avatar.png"
            alt="User"
            width={36}
            height={36}
            className="rounded-full cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 z-50">
              <a
                href="/profile"
                className="block px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white"
              >
                My Profile
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white"
              >
                Settings
              </a>
              <a
                href="/logout"
                className="block px-4 py-2 text-sm hover:bg-red-100 dark:hover:bg-red-600 text-red-600 dark:text-red-300"
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
