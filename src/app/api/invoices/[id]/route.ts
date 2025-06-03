// src/app/api/invoices/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createInvoiceSchema = z.object({
  customerId: z.string(),
  date: z.string(), // ISO date string: "2025-06-01"
  status: z.enum(["PAID", "UNPAID"]).optional(),
  items: z.array(
    z.object({
      drugId: z.string(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().nonnegative(),
    })
  ),
});

export async function GET() {
  try {
    const list = await prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        customer: {
          select: { id: true, name: true },
        },
      },
    });
    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json(
      { error: "Cannot fetch invoices" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = createInvoiceSchema.parse(json);

    const total = data.items.reduce(
      (sum, it) => sum + it.quantity * it.unitPrice,
      0
    );

    const inv = await prisma.invoice.create({
      data: {
        customer: { connect: { id: data.customerId } },
        date: new Date(data.date),
        status: data.status || "UNPAID",
        total,
        items: {
          create: data.items.map((it) => ({
            drug: { connect: { id: it.drugId } },
            quantity: it.quantity,
            unitPrice: it.unitPrice,
          })),
        },
      },
      include: { items: true },
    });
    return NextResponse.json(inv, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Cannot create invoice" },
      { status: 500 }
    );
  }
}
