// src/app/api/inventory/alerts/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const LOW_STOCK_THRESHOLD = 10;
    const EXPIRY_SOON_DAYS = 7;
    const today = new Date();
    const soonDate = new Date();
    soonDate.setDate(today.getDate() + EXPIRY_SOON_DAYS);

    const lowStockList = await prisma.drug.findMany({
      where: {
        quantity: { lt: LOW_STOCK_THRESHOLD, gt: 0 },
      },
      select: { id: true, name: true, quantity: true },
    });

    const expiringSoonList = await prisma.drug.findMany({
      where: {
        expiryDate: { lte: soonDate, gt: today },
        quantity: { gt: 0 },
      },
      select: { id: true, name: true, expiryDate: true },
    });

    const expiredList = await prisma.drug.findMany({
      where: {
        expiryDate: { lt: today },
        quantity: { gt: 0 },
      },
      select: { id: true, name: true, expiryDate: true },
    });

    return NextResponse.json({
      lowStock: lowStockList,
      expiringSoon: expiringSoonList,
      expired: expiredList,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Cannot fetch alerts" }, { status: 500 });
  }
}
