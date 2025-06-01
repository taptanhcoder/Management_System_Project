// src/app/api/prescriptions/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createPrescriptionSchema = z.object({
  customer: z.string(),
  date: z.string(), // ISO date: "2025-05-25"
  status: z.enum(["PENDING", "CONFIRMED"]).optional(),
  medicines: z.array(
    z.object({
      drugId: z.string(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().nonnegative(),
    })
  ),
});

export async function GET() {
  try {
    const list = await prisma.prescription.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json(
      { error: "Cannot fetch prescriptions" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = createPrescriptionSchema.parse(json);

    // Tính tổng tiền
    const total = data.medicines.reduce(
      (sum, it) => sum + it.quantity * it.unitPrice,
      0
    );

    const pres = await prisma.prescription.create({
      data: {
        customer: data.customer,
        date: new Date(data.date),
        status: data.status || "PENDING",
        total,
        items: {
          create: data.medicines.map((it) => ({
            drug: { connect: { id: it.drugId } },
            quantity: it.quantity,
            unitPrice: it.unitPrice,
          })),
        },
      },
      include: {
        items: true,
      },
    });
    return NextResponse.json(pres, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Cannot create prescription" },
      { status: 500 }
    );
  }
}
