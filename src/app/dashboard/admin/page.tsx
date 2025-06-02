
import { ShieldCheck, DollarSign, Package, AlertTriangle } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import InfoBlock from "@/components/InfoBlock";

const DashboardPage = () => {
  const stats = [
    {
      title: "Inventory Status",
      value: "Good",
      icon: <ShieldCheck className="text-green-600" />,
      action: "View Detailed Report",
      bg: "bg-green-100",
    },
    {
      title: "Revenue",
      value: "Rs. 8,55,875",
      icon: <DollarSign className="text-yellow-600" />,
      action: "View Detailed Report",
      bg: "bg-yellow-100",
    },
    {
      title: "Medicines Available",
      value: "298",
      icon: <Package className="text-blue-600" />,
      action: "Visit Inventory",
      bg: "bg-blue-100",
    },
    {
      title: "Medicine Shortage",
      value: "01",
      icon: <AlertTriangle className="text-red-600" />,
      action: "Resolve Now",
      bg: "bg-red-100",
    },
  ];

  return (
    <div className="p-6 space-y-8 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        A quick data overview of the inventory.
      </p>

      {/* Top 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <DashboardCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            action={stat.action}
            bg={stat.bg}
          />
        ))}
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoBlock
          title="Inventory"
          link={{ href: "/configuration", text: "Go to Configuration" }}
          items={[
            { value: "298", label: "Total no of Medicines" },
            { value: "24", label: "Medicine Groups" },
          ]}
        />

        <InfoBlock
          title="Quick Report"
          rightLabel="January 2022 ▼"
          items={[
            { value: "70,856", label: "Qty of Medicines Sold" },
            { value: "5,288", label: "Invoices Generated" },
          ]}
        />

        <InfoBlock
          title="My Pharmacy"
          link={{ href: "/user-management", text: "Go to User Management" }}
          items={[
            { value: "04", label: "Total no of Suppliers" },
            { value: "05", label: "Total no of Users" },
          ]}
        />

        <InfoBlock
          title="Customers"
          link={{ href: "/customers", text: "Go to Customers Page" }}
          items={[
            { value: "845", label: "Total no of Customers" },
            { value: "Adalimumab", label: "Frequently bought Item" },
          ]}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
