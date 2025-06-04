// src/app/api/dashboard/finance-summary/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type FinanceData = {
  month: string;   // "Jan", "Feb", ...
  income: number;
  expense: number;
};

export async function GET() {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const result: FinanceData[] = [];

    for (let m = 0; m < 12; m++) {
      const startOfMonth = new Date(year, m, 1);
      const endOfMonth = new Date(year, m + 1, 0, 23, 59, 59);

      // Income: tổng invoice.total của các hóa đơn PAID trong tháng
      const incAgg = await prisma.invoice.aggregate({
        _sum: { total: true },
        where: {
          date: { gte: startOfMonth, lte: endOfMonth },
          status: "PAID",
        },
      });
      const income = incAgg._sum.total || 0;

      // Expense: tổng purchasePrice của Drug nhập trong tháng (chỉ ví dụ)
      const expAgg = await prisma.drug.aggregate({
        _sum: { purchasePrice: true },
        where: {
          createdAt: { gte: startOfMonth, lte: endOfMonth },
        },
      });
      const expense = expAgg._sum.purchasePrice || 0;

      result.push({
        month: monthNames[m],
        income,
        expense,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in /api/dashboard/finance-summary:", error);
    return NextResponse.json({ error: "Cannot fetch finance summary" }, { status: 500 });
  }
}
