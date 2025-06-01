"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type MenuProps = {
  collapsed: boolean;
};

const Menu = ({ collapsed }: MenuProps) => {
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);

  return (
    <nav className="flex flex-col gap-6 mt-6">
      {/* OVERVIEW */}
      {!collapsed && (
        <h3 className="text-xs font-bold text-gray-500 mb-2 px-2 uppercase">OVERVIEW</h3>
      )}
      <ul className="flex flex-col gap-1">
        <li>
          <Link href="/dashboard/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Image src="/dashboard.png" alt="Dashboard" width={20} height={20} />
            {!collapsed && <span className="text-sm">Dashboard</span>}
          </Link>
        </li>

        {/* PRESCRIPTIONS */}
        <li>
          <button
            onClick={() => setIsPrescriptionOpen(!isPrescriptionOpen)}
            className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <div className="flex items-center gap-3">
              <Image src="/prescription.png" alt="Prescriptions" width={20} height={20} />
              {!collapsed && <span className="text-sm">Prescriptions</span>}
            </div>
            {!collapsed && <span>{isPrescriptionOpen ? "▾" : "▸"}</span>}
          </button>

          {/* SUBMENU */}
          {isPrescriptionOpen && !collapsed && (
            <ul className="ml-10 mt-1 flex flex-col gap-1">
              <li>
                <Link href="/dashboard/prescriptions" className="text-sm text-gray-700 dark:text-gray-300 hover:underline">
                  List of Prescriptions
                </Link>
              </li>
              <li>
                <Link href="/prescriptions/new" className="text-sm text-gray-700 dark:text-gray-300 hover:underline">
                  Add New Prescription
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>

      {/* INVENTORY */}
      {!collapsed && (
        <h3 className="text-xs font-bold text-gray-500 mb-2 px-2 uppercase">INVENTORY</h3>
      )}
      <ul className="flex flex-col gap-1">
        <li>
          <Link href="/inventory" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Image src="/inventory.png" alt="Stock Overview" width={20} height={20} />
            {!collapsed && <span className="text-sm">Stock Overview</span>}
          </Link>
        </li>
        <li>
          <Link href="/inventory/import" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Image src="/import.png" alt="Import Stock" width={20} height={20} />
            {!collapsed && <span className="text-sm">Import Stock</span>}
          </Link>
        </li>
        <li>
          <Link href="/alerts" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Image src="/expiry.png" alt="Expiration Alerts" width={20} height={20} />
            {!collapsed && <span className="text-sm">Expiration Alerts</span>}
          </Link>
        </li>
        <li>
          <Link href="/catalog" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Image src="/catalog.png" alt="Drug Catalog" width={20} height={20} />
            {!collapsed && <span className="text-sm">Drug Catalog</span>}
          </Link>
        </li>
      </ul>

      {/* ACCOUNT */}
      {!collapsed && (
        <h3 className="text-xs font-bold text-gray-500 mb-2 px-2 uppercase">ACCOUNT</h3>
      )}
      <ul className="flex flex-col gap-1">
        <li>
          <Link href="/profile" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Image src="/profile.png" alt="My Profile" width={20} height={20} />
            {!collapsed && <span className="text-sm">My Profile</span>}
          </Link>
        </li>
        <li>
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Image src="/setting.png" alt="Settings" width={20} height={20} />
            {!collapsed && <span className="text-sm">Settings</span>}
          </Link>
        </li>
        <li>
          <Link href="/logout" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Image src="/logout.png" alt="Logout" width={20} height={20} />
            {!collapsed && <span className="text-sm">Logout</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
