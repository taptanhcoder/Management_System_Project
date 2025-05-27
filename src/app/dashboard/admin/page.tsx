"use client";

import CountChart from "@/components/CountChart"; // Biểu đồ tổng quan thuốc
import InventoryChart from "@/components/InventoryChart";
import SaleChart from "@/components/SaleChart";
import EventCalendar from "@/components/EventCalendar";
import UserCard from "@/components/UserCard";

const AdminPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="MEDICINES" />
          <UserCard type="CUSTOMER" />
          <UserCard type="PRESCRIPTION" />
          <UserCard type="STOCK" />
        </div>

        {/* MIDDLE CHARTS */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px] bg-blue-200 dark:bg-blue-400 rounded-xl shadow-md p-4 text-blue-900 dark:text-blue-900">
            <CountChart />
          </div>

          {/* INVENTORY CHART */}
          <div className="w-full lg:w-2/3 h-[450px] bg-blue-200 dark:bg-blue-400 rounded-xl shadow-md p-4 text-blue-900 dark:text-blue-900">
            <InventoryChart />
          </div>
        </div>

        {/* BOTTOM CHART */}
        <div className="w-full h-[500px] bg-blue-200 dark:bg-blue-400 rounded-xl shadow-md p-4 text-blue-900 dark:text-blue-900">
          <SaleChart />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <div className="bg-blue-200 dark:bg-blue-400 rounded-xl shadow-md p-4 text-blue-900 dark:text-blue-900">
          <EventCalendar />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
