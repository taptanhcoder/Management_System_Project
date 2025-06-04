// src/components/FinanceChart.tsx
"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface FinanceData {
  month: string;    // "Jan", "Feb", ...
  income: number;
  expense: number;
}

interface FinanceChartProps {
  className?: string;
}

const FinanceChart = ({ className = "" }: FinanceChartProps) => {
  const [data, setData] = useState<FinanceData[]>([]);

  useEffect(() => {
    async function fetchFinanceData() {
      try {
        const res = await fetch("/api/dashboard/finance-summary");
        if (!res.ok) throw new Error("Cannot fetch finance data");
        const json: FinanceData[] = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      }
    }
    fetchFinanceData();
  }, []);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl w-full h-full p-4 shadow ${className}`}>
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
        Finance Overview
      </h2>
      <ResponsiveContainer width="100%" aspect={2}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tick={{ fill: "#6b7280" }}
            tickLine={false}
            tickMargin={8}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#6b7280" }}
            tickLine={false}
            tickFormatter={(val) => `$${val}`}
          />
          <Tooltip formatter={(val: number) => `$${val}`} labelStyle={{ color: "#374151" }} />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: 12 }}
            formatter={(value) =>
              value === "income" ? (
                <span className="text-green-500">Income</span>
              ) : (
                <span className="text-red-500">Expense</span>
              )
            }
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#34D399"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#F87171"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
