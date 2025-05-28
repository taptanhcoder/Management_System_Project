"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Total",
    count: 200,
    fill: "#4F46E5", // tím đậm
  },
  {
    name: "Expired",
    count: 40,
    fill: "#F87171", // đỏ nhẹ
  },
  {
    name: "In Stock",
    count: 160,
    fill: "#34D399", // xanh lá
  },
];

const CountChart = () => {
  return (
    <div className="bg-blue-200 dark:bg-blue-400 rounded-xl w-full h-full p-4 text-gray-900 dark:text-white">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Medicines Overview</h1>
        <Image src="/moreDark.png" alt="More options" width={20} height={20} />
      </div>

      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>

        <Image
          src="/medicineIcon.png" // Bạn có thể thay icon phù hợp
          alt="Medicines Icon"
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* BOTTOM LEGEND */}
      <div className="flex justify-center gap-16 mt-4 text-gray-500 dark:text-gray-300">
        <div className="flex flex-col items-center gap-1">
          <div className="w-5 h-5 rounded-full bg-[#34D399]" />
          <h1 className="font-bold text-white">160</h1>
          <h2 className="text-xs">In Stock (80%)</h2>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-5 h-5 rounded-full bg-[#F87171]" />
          <h1 className="font-bold text-white">40</h1>
          <h2 className="text-xs">Expired (20%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
