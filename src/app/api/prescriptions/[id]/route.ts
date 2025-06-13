// src/app/api/prescriptions/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updatePrescriptionSchema = z.object({
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

// GET /api/prescriptions/:id
export async function GET(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  const pres = await prisma.prescription.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!pres) {
    return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
  }
  return NextResponse.json(pres);
}

// PUT /api/prescriptions/:id
export async function PUT(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  const json = await request.json();
  const { customer, date, status, medicines } = updatePrescriptionSchema.parse(json);

  return prisma.$transaction(async (tx) => {
    const oldPres = await tx.prescription.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!oldPres) throw new Error("Prescription không tồn tại");

    // Xóa items cũ
    await tx.prescriptionItem.deleteMany({ where: { prescriptionId: id } });

    // Tạo items mới
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

    const updated = await tx.prescription.update({
      where: { id },
      data: {
        customer,
        date: new Date(date),
        status,
        total,
        items: { create: itemsData },
      },
      include: { items: true },
    });

    // NOTE: Không trừ kho tại đây nữa

    return updated;
  })
  .then((pres) => NextResponse.json(pres))
  .catch((err: any) => NextResponse.json({ error: err.message }, { status: 400 }));
}
