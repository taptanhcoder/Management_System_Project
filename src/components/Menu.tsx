// src/components/Menu.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Home,
  Box,
  FileText,
  Layers,
  Users,
  UserCircle2,
  LogOut,
} from "lucide-react";

type MenuProps = {
  collapsed: boolean;
};

const Menu = ({ collapsed }: MenuProps) => {
  const [presOpen, setPresOpen] = useState(false);

  return (
    <nav className="flex flex-col gap-4 mt-6">
      {/* OVERVIEW */}
      {!collapsed && (
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 px-2 uppercase">
          OVERVIEW
        </h3>
      )}
      <ul className="flex flex-col gap-1">
        <li>
          <Link
            href="/dashboard/admin"
            title="Dashboard Overview"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <Home size={20} className="text-gray-600 dark:text-gray-300" />
            {!collapsed && (
              <span className="text-sm text-gray-800 dark:text-gray-100">
                Dashboard
              </span>
            )}
          </Link>
        </li>
      </ul>

      {/* INVENTORY */}
      {!collapsed && (
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 px-2 uppercase">
          INVENTORY
        </h3>
      )}
      <ul className="flex flex-col gap-1">
        <li>
          <Link
            href="/dashboard/inventory"
            title="Stock Overview"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <Box size={20} className="text-gray-600 dark:text-gray-300" />
            {!collapsed && (
              <span className="text-sm text-gray-800 dark:text-gray-100">
                Inventory
              </span>
            )}
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/inventory/new"
            title="Add New Drug"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <Layers size={20} className="text-gray-600 dark:text-gray-300" />
            {!collapsed && (
              <span className="text-sm text-gray-800 dark:text-gray-100">
                Add New Drug
              </span>
            )}
          </Link>
        </li>
      </ul>

      {/* PRESCRIPTIONS */}
      {!collapsed && (
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 px-2 uppercase">
          PRESCRIPTIONS
        </h3>
      )}
      <ul className="flex flex-col gap-1">
        <li>
          <button
            onClick={() => setPresOpen(!presOpen)}
            title="Prescriptions"
            className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-gray-600 dark:text-gray-300" />
              {!collapsed && (
                <span className="text-sm text-gray-800 dark:text-gray-100">
                  Prescriptions
                </span>
              )}
            </div>
            {!collapsed && (
              <span className="text-gray-400">{presOpen ? "▾" : "▸"}</span>
            )}
          </button>
        </li>
        {presOpen && !collapsed && (
          <ul className="ml-8 flex flex-col gap-1">
            <li>
              <Link
                href="/dashboard/prescriptions"
                className="text-sm text-gray-700 dark:text-gray-300 hover:underline"
              >
                List
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/prescriptions/new"
                className="text-sm text-gray-700 dark:text-gray-300 hover:underline"
              >
                New Prescription
              </Link>
            </li>
          </ul>
        )}
      </ul>

      {/* CATALOG */}
      {!collapsed && (
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 px-2 uppercase">
          CATALOG
        </h3>
      )}
      <ul className="flex flex-col gap-1">
        <li>
          <Link
            href="/dashboard/catalog"
            title="Drug Categories"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <Layers size={20} className="text-gray-600 dark:text-gray-300" />
            {!collapsed && (
              <span className="text-sm text-gray-800 dark:text-gray-100">
                Categories
              </span>
            )}
          </Link>
        </li>
      </ul>

      {/* CUSTOMERS */}
      {!collapsed && (
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 px-2 uppercase">
          CUSTOMERS
        </h3>
      )}
      <ul className="flex flex-col gap-1">
        <li>
          <Link
            href="/dashboard/customers"
            title="Customer List"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <Users size={20} className="text-gray-600 dark:text-gray-300" />
            {!collapsed && (
              <span className="text-sm text-gray-800 dark:text-gray-100">
                Customers
              </span>
            )}
          </Link>
        </li>
      </ul>

      {/* INVOICES */}
      {!collapsed && (
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 px-2 uppercase">
          BILLING
        </h3>
      )}
      <ul className="flex flex-col gap-1">
        <li>
          <Link
            href="/dashboard/invoices"
            title="Invoices"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {!collapsed && (
              <span className="text-sm text-gray-800 dark:text-gray-100">
                Invoices
              </span>
            )}
          </Link>
        </li>
      </ul>

      {/* ACCOUNT */}
      {!collapsed && (
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 px-2 uppercase">
          ACCOUNT
        </h3>
      )}
      <ul className="flex flex-col gap-1 mb-8">
        <li>
          <Link
            href="/dashboard/profile"
            title="My Profile"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <UserCircle2 size={20} className="text-gray-600 dark:text-gray-300" />
            {!collapsed && (
              <span className="text-sm text-gray-800 dark:text-gray-100">
                My Profile
              </span>
            )}
          </Link>
        </li>
        <li>
          <button
            onClick={() => {

            }}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-100 dark:hover:bg-red-700 transition"
            title="Logout"
          >
            <LogOut size={20} className="text-red-600 dark:text-red-400" />
            {!collapsed && (
              <span className="text-sm text-red-600">Logout</span>
            )}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
