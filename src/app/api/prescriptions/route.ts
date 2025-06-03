// src/app/api/prescriptions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema validate cho POST /api/prescriptions
const createPrescriptionSchema = z.object({
  customer: z.string(),
  date: z.string(),
  status: z.enum(["PENDING", "CONFIRMED"]).optional(),
  medicines: z.array(
    z.object({
      drugId: z.string(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().nonnegative(),
    })
  ),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = createPrescriptionSchema.parse(json);

    const total = data.medicines.reduce(
      (sum, it) => sum + it.quantity * it.unitPrice,
      0
    );

    const newPrescription = await prisma.prescription.create({
      data: {
        customer: data.customer,
        date: new Date(data.date),
        status: data.status ?? "PENDING",
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

    return NextResponse.json(newPrescription, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    console.error("API POST /api/prescriptions error:", err);
    return NextResponse.json(
      { error: "Không thể tạo đơn thuốc mới" },
      { status: 500 }
    );
  }
}
