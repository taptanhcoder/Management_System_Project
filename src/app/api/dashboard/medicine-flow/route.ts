// src/app/api/dashboard/medicine-flow/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type FlowDay = {
  day: string;       // "Mon", "Tue", ...
  received: number;
  sold: number;
};

export async function GET() {
  try {
    // Xác định ngày Thứ Hai của tuần hiện tại
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0(Sun) .. 6(Sat)
    // Tính offset để về thứ Hai
    const offsetToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + offsetToMonday);
    monday.setHours(0, 0, 0, 0);

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const flowData: FlowDay[] = [];

    for (let i = 0; i < 5; i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);
      const startOfDay = new Date(dayDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dayDate);
      endOfDay.setHours(23, 59, 59, 999);

      // received = tổng quantity của Drug nhập trong ngày đó
      const recAgg = await prisma.drug.aggregate({
        _sum: { quantity: true },
        where: {
          createdAt: { gte: startOfDay, lte: endOfDay },
        },
      });
      const received = recAgg._sum.quantity || 0;

      // sold = tổng quantity của PrescriptionItem trong ngày đó, prescription.status = "CONFIRMED"
      const soldAgg = await prisma.prescriptionItem.aggregate({
        _sum: { quantity: true },
        where: {
          prescription: {
            createdAt: { gte: startOfDay, lte: endOfDay },
            status: "CONFIRMED",
          },
        },
      });
      const sold = soldAgg._sum.quantity || 0;

      flowData.push({
        day: dayNames[dayDate.getDay()],
        received,
        sold,
      });
    }

    return NextResponse.json(flowData);
  } catch (error) {
    console.error("Error in /api/dashboard/medicine-flow:", error);
    return NextResponse.json({ error: "Cannot fetch medicine flow" }, { status: 500 });
  }
}
