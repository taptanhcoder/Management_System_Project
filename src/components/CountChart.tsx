// src/components/CountChart.tsx
"use client";

import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

interface CountChartProps {
  total: number;
  expired: number;
  inStock: number;
  className?: string;
}

const CountChart = ({ total, expired, inStock, className = "" }: CountChartProps) => {
  const inStockPercent = total > 0 ? Math.round((inStock / total) * 100) : 0;
  const expiredPercent = total > 0 ? 100 - inStockPercent : 0;

  const data = [
    { name: "In Stock", count: inStock, fill: "#34D399" },
    { name: "Expired", count: expired, fill: "#F87171" },
  ];

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl w-full h-full p-4 text-gray-900 dark:text-white shadow ${className}`}
    >
      {/* Title Bar */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Medicines Overview</h2>
        <Image src="/moreDark.png" alt="More options" width={20} height={20} />
      </div>

      {/* Radial Chart */}
      <div className="relative w-full h-[60%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={20}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/medicineIcon.png"
          alt="Medicines Icon"
          width={48}
          height={48}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Legend */}
      <div className="flex justify-around items-center mt-4 text-gray-600 dark:text-gray-300">
        <div className="flex flex-col items-center gap-1">
          <div className="w-5 h-5 rounded-full bg-[#34D399]" />
          <p className="font-semibold text-gray-900 dark:text-white">{inStock}</p>
          <p className="text-xs">In Stock ({inStockPercent}%)</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-5 h-5 rounded-full bg-[#F87171]" />
          <p className="font-semibold text-gray-900 dark:text-white">{expired}</p>
          <p className="text-xs">Expired ({expiredPercent}%)</p>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
