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
      id: z.string().optional(), // nếu chỉnh sửa item cũ
      drugId: z.string(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().nonnegative(),
    })
  ),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const pres = await prisma.prescription.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!pres) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(pres);
  } catch (error) {
    return NextResponse.json(
      { error: "Cannot fetch prescription" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const json = await request.json();
    const data = updatePrescriptionSchema.parse(json);

    const total = data.medicines.reduce(
      (sum, it) => sum + it.quantity * it.unitPrice,
      0
    );

    // Xóa hết item cũ (cách đơn giản nhất)
    await prisma.prescriptionItem.deleteMany({
      where: { prescriptionId: id },
    });

    const updated = await prisma.prescription.update({
      where: { id },
      data: {
        customer: data.customer,
        date: new Date(data.date),
        status: data.status || undefined,
        total,
        items: {
          create: data.medicines.map((it) => ({
            drug: { connect: { id: it.drugId } },
            quantity: it.quantity,
            unitPrice: it.unitPrice,
          })),
        },
      },
      include: { items: true },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Cannot update prescription" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await prisma.prescriptionItem.deleteMany({
      where: { prescriptionId: id },
    });
    await prisma.prescription.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Cannot delete prescription" },
      { status: 500 }
    );
  }
}
