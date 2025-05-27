"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", received: 60, sold: 50 },
  { day: "Tue", received: 70, sold: 60 },
  { day: "Wed", received: 90, sold: 80 },
  { day: "Thu", received: 65, sold: 70 },
  { day: "Fri", received: 60, sold: 55 },
];

const AttendanceChart = () => {
  return (
    <div className="bg-white rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Daily Medicine Flow
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="day"
            stroke="#b0b0b0"
            tickLine={false}
            axisLine={false}
            style={{ fontSize: 12, fontWeight: 500 }}
          />
          <YAxis
            stroke="#b0b0b0"
            tickLine={false}
            axisLine={false}
            style={{ fontSize: 12 }}
            domain={[0, 100]}
            tickCount={6}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", borderRadius: 6 }}
            cursor={{ fill: "rgba(0,0,0,0.1)" }}
          />
          <Legend
            verticalAlign="top"
            align="left"
            iconType="circle"
            wrapperStyle={{ paddingBottom: 10, fontSize: 14, color: "#999" }}
            formatter={(value) =>
              value === "received" ? (
                <span className="text-green-500">Received</span>
              ) : (
                <span className="text-red-500">Sold</span>
              )
            }
          />
          <Bar dataKey="received" fill="#34D399" barSize={20} radius={[5, 5, 0, 0]} />
          <Bar dataKey="sold" fill="#F87171" barSize={20} radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
