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
  invoicesToday: number;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard/summary");
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to fetch summary");
        }
        const json: DashboardStats = await res.json();
        setStats(json);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <p className="p-6">Loading dashboard data...</p>;
  }
  if (error) {
    return <p className="p-6 text-red-600">Error: {error}</p>;
  }
  if (!stats) {
    return null;
  }

  // 1. Summary Cards
  const summaryCards = [
    {
      title: "Inventory Status",
      value: stats.inventoryStatus,
      icon: <ShieldCheck className="text-green-600" />,
      action: "View Details",
      href: "/dashboard/inventory",
      bgClass: stats.inventoryStatus === "Good" ? "bg-green-100" : "bg-yellow-100",
    },
    {
      title: "Revenue (This Month)",
      value: `$${stats.revenueThisMonth.toLocaleString()}`,
      icon: <DollarSign className="text-yellow-600" />,
      action: "View Finance",
      href: "/dashboard/finance",
      bgClass: "bg-yellow-100",
    },
    {
      title: "Medicine Categories",
      value: stats.medicineGroups.toString(),
      icon: <Package className="text-blue-600" />,
      action: "View Categories",
      href: "/dashboard/catalog",
      bgClass: "bg-blue-100",
    },
    {
      title: "Low Stock",
      value: stats.lowStockCount.toString(),
      icon: <AlertTriangle className="text-red-600" />,
      action: "View Alerts",
      href: "/dashboard/alerts",
      bgClass: "bg-red-100",
    },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Quick summary of inventory, finance, and alerts.
        </p>
      </header>

      {/* 1. Summary Cards */}
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

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 2a. CountChart */}
        <CountChart
          total={stats.totalMedicines}
          expired={stats.lowStockExpired}
          inStock={stats.totalMedicines - stats.lowStockExpired}
          className="col-span-1"
        />

        {/* 2b. MedicineFlowChart */}
        <MedicineFlowChart className="col-span-1 md:col-span-2" />

        {/* 2c. FinanceChart */}
        <FinanceChart className="col-span-1" />
      </div>

      {/* 3. Info Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 3a. Inventory Details */}
        <InfoBlock
          title="Inventory Details"
          link={{ href: "/dashboard/inventory", text: "Manage Inventory" }}
          items={[
            { value: stats.totalMedicines.toString(), label: "Total Medicines" },
            { value: stats.medicineGroups.toString(), label: "Medicine Groups" },
          ]}
        />

        {/* 3b. Quick Report */}
        <InfoBlock
          title="Quick Report"
          rightLabel={`Invoices Today: ${stats.invoicesToday}`}
          items={[
            { value: stats.soldToday.toString(), label: "Medicines Sold Today" },
            { value: stats.receivedToday.toString(), label: "Medicines Received Today" },
          ]}
        />

        {/* 3c. My Pharmacy (Suppliers & Employees) */}
        <InfoBlock
          title="My Pharmacy"
          link={{ href: "/dashboard/suppliers", text: "Manage Suppliers" }}
          items={[
            { value: stats.totalSuppliers.toString(), label: "Total Suppliers" },
            { value: stats.totalEmployees.toString(), label: "Total Employees" },
          ]}
        />

        {/* 3d. Customers */}
        <InfoBlock
          title="Customers"
          link={{ href: "/dashboard/customers", text: "Manage Customers" }}
          items={[
            { value: stats.totalCustomers.toString(), label: "Total Customers" },
            { value: stats.frequentItem, label: "Top Selling Item" },
          ]}
        />
      </div>

      {/* 4. User Cards (Employees, Customers, Suppliers) */}
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
