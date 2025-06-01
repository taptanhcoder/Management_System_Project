// src/app/dashboard/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  DollarSign,
  Package,
  AlertTriangle,
} from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import InfoBlock from "@/components/InfoBlock";
import CountChart from "@/components/CountChart";
import MedicineFlowChart from "@/components/MedicineFlowChart";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";

interface DashboardStats {
  inventoryStatus: string;
  totalMedicines: number;
  medicineGroups: number;
  receivedToday: number;
  soldToday: number;
  revenueThisMonth: number;
  expenseThisMonth: number;
  lowStockCount: number;
  lowStockExpired: number;
  totalEmployees: number;
  totalCustomers: number;
  totalSuppliers: number;
  frequentItem: string;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      // TODO: Replace this mock with a real API call, e.g.:
      // const res = await fetch("/api/dashboard/summary");
      // const json: DashboardStats = await res.json();
      const json: DashboardStats = {
        inventoryStatus: "Good",
        totalMedicines: 298,
        medicineGroups: 24,
        receivedToday: 60,
        soldToday: 50,
        revenueThisMonth: 12000,
        expenseThisMonth: 8000,
        lowStockCount: 16,
        lowStockExpired: 4,
        totalEmployees: 5,
        totalCustomers: 845,
        totalSuppliers: 4,
        frequentItem: "Paracetamol 500mg",
      };
      setStats(json);
    }
    fetchStats();
  }, []);

  if (!stats) {
    return <p className="p-6">Loading dashboard data...</p>;
  }

  // Top summary cards
  const summaryCards = [
    {
      title: "Inventory Status",
      value: stats.inventoryStatus,
      icon: <ShieldCheck className="text-green-600" />,
      action: "View Details",
      href: "/dashboard/inventory",
      bgClass: "bg-green-100",
    },
    {
      title: "Revenue (This Month)",
      value: `$${stats.revenueThisMonth}`,
      icon: <DollarSign className="text-yellow-600" />,
      action: "View Finance",
      href: "/dashboard/finance",
      bgClass: "bg-yellow-100",
    },
    {
      title: "Medicines Available",
      value: stats.totalMedicines.toString(),
      icon: <Package className="text-blue-600" />,
      action: "View Stock",
      href: "/dashboard/inventory",
      bgClass: "bg-blue-100",
    },
    {
      title: "Expiring / Low Stock",
      value: stats.lowStockCount.toString(),
      icon: <AlertTriangle className="text-red-600" />,
      action: "View Alerts",
      href: "/dashboard/alerts",
      bgClass: "bg-red-100",
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Quick summary of inventory, finance, and alerts.
        </p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, idx) => (
          <DashboardCard
            key={idx}
            title={card.title}
            value={card.value}
            icon={card.icon}
            action={card.action}
            href={card.href}
            bgClass={card.bgClass}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CountChart for In-Stock vs Expired */}
        <CountChart
          total={stats.totalMedicines}
          expired={stats.lowStockExpired}
          inStock={stats.totalMedicines - stats.lowStockExpired}
          className="col-span-1"
        />

        {/* MedicineFlowChart */}
        <MedicineFlowChart className="col-span-1 md:col-span-2" />

        {/* FinanceChart */}
        <FinanceChart className="col-span-1" />
      </div>

      {/* Info Blocks / Smaller Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoBlock
          title="Inventory Details"
          link={{ href: "/dashboard/inventory", text: "Manage Inventory" }}
          items={[
            { value: stats.totalMedicines.toString(), label: "Total Medicines" },
            { value: stats.medicineGroups.toString(), label: "Medicine Groups" },
          ]}
        />

        <InfoBlock
          title="Sales Overview"
          rightLabel={`Today: Received ${stats.receivedToday}, Sold ${stats.soldToday}`}
          items={[
            { value: `$${stats.revenueThisMonth}`, label: "Revenue (This Month)" },
            { value: `$${stats.expenseThisMonth}`, label: "Expenses (This Month)" },
          ]}
        />

        <InfoBlock
          title="Pharmacy Contacts"
          link={{ href: "/dashboard/suppliers", text: "Manage Suppliers" }}
          items={[
            { value: stats.totalSuppliers.toString(), label: "Total Suppliers" },
            { value: stats.totalCustomers.toString(), label: "Total Customers" },
          ]}
        />

        <InfoBlock
          title="Employee & Frequent Item"
          items={[
            { value: stats.totalEmployees.toString(), label: "Total Employees" },
            { value: stats.frequentItem, label: "Top Selling Item" },
          ]}
        />
      </div>

      {/* User Cards (e.g. employees, customers) */}
      <div className="flex flex-wrap gap-6">
        <UserCard
          label="Employees"
          count={stats.totalEmployees}
          period="2025"
          bgColor="bg-green-200"
        />
        <UserCard
          label="Customers"
          count={stats.totalCustomers}
          period="Q2"
          bgColor="bg-blue-200"
        />
        <UserCard
          label="Suppliers"
          count={stats.totalSuppliers}
          bgColor="bg-yellow-200"
        />
      </div>
    </div>
  );
};

export default DashboardPage;
