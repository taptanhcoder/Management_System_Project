// src/app/api/inventory/report/summary/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const LOW_STOCK_THRESHOLD = 10;
    const EXPIRY_SOON_DAYS = 7;
    const today = new Date();
    const soonDate = new Date();
    soonDate.setDate(today.getDate() + EXPIRY_SOON_DAYS);

    const totalDrugs = await prisma.drug.count();
    const outOfStock = await prisma.drug.count({ where: { quantity: 0 } });
    const expired = await prisma.drug.count({
      where: { expiryDate: { lt: today }, quantity: { gt: 0 } },
    });
    const expiringSoon = await prisma.drug.count({
      where: { expiryDate: { lte: soonDate, gt: today }, quantity: { gt: 0 } },
    });
    const lowStock = await prisma.drug.count({
      where: { quantity: { lt: LOW_STOCK_THRESHOLD, gt: 0 } },
    });

    // Số lượng theo nhóm (sum quantity)
    const groupByCategory = await prisma.drug.groupBy({
      by: ["categoryId"],
      _sum: { quantity: true },
    });
    // Join thêm tên category (nếu muốn)
    const categoryData = await Promise.all(
      groupByCategory.map(async (g) => {
        const cat = await prisma.category.findUnique({
          where: { id: g.categoryId },
          select: { name: true },
        });
        return {
          categoryId: g.categoryId,
          categoryName: cat?.name || "Unknown",
          totalQuantity: g._sum.quantity || 0,
        };
      })
    );

    return NextResponse.json({
      totalDrugs,
      outOfStock,
      expired,
      expiringSoon,
      lowStock,
      byCategory: categoryData,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Cannot fetch report" }, { status: 500 });
  }
}
