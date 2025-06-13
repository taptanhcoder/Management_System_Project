//src/app/api/prescriptions/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createPrescriptionSchema = z.object({
  customer: z.string(),
  date: z.string(),
  status: z.enum(["PENDING", "CONFIRMED"]).optional(),
  medicines: z.array(
    z.object({
      drugId: z.string(),
      quantity: z.number().int().positive(),
    })
  ),
});

// GET /api/prescriptions?status=PENDING
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as "PENDING" | "CONFIRMED" | null;

  const where: Record<string, any> = {};
  if (status) where.status = status;

  const list = await prisma.prescription.findMany({
    where,
    select: { id: true, customer: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(list);
}

// POST /api/prescriptions
export async function POST(request: Request) {
  const json = await request.json();
  const { customer, date, status, medicines } = createPrescriptionSchema.parse(json);

  return prisma.$transaction(async (tx) => {
    // Build items with unitPrice = purchasePrice
    const itemsData = await Promise.all(
      medicines.map(async (m) => {
        const drug = await tx.drug.findUnique({ where: { id: m.drugId } });
        if (!drug) throw new Error(`Drug ${m.drugId} not found`);
        return {
          drugId: m.drugId,
          quantity: m.quantity,
          unitPrice: drug.purchasePrice,
        };
      })
    );

    const total = itemsData.reduce((sum, it) => sum + it.quantity * it.unitPrice, 0);

    const pres = await tx.prescription.create({
      data: {
        customer,
        date: new Date(date),
        status: status ?? "PENDING",
        total,
        items: { create: itemsData },
      },
      include: { items: true },
    });

    // NOTE: Không trừ kho tại đây nữa

    return pres;
  })
  .then((pres) => NextResponse.json(pres, { status: 201 }))
  .catch((err: any) => NextResponse.json({ error: err.message }, { status: 400 }));
}
