// src/app/api/invoices/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateInvoiceSchema = z.object({
  customerId: z.string(),
  date: z.string(),
  status: z.enum(["PAID", "UNPAID"]).optional(),
  items: z.array(
    z.object({
      id: z.string().optional(), // nếu edit item cũ
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
    const inv = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!inv) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(inv);
  } catch (error) {
    return NextResponse.json(
      { error: "Cannot fetch invoice" },
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
    const data = updateInvoiceSchema.parse(json);

    const total = data.items.reduce(
      (sum, it) => sum + it.quantity * it.unitPrice,
      0
    );

    // Xóa hết item cũ
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });

    const updated = await prisma.invoice.update({
      where: { id },
      data: {
        customer: { connect: { id: data.customerId } },
        date: new Date(data.date),
        status: data.status,
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
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Cannot update invoice" },
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
    // Xóa item rồi xóa invoice
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
    await prisma.invoice.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Cannot delete invoice" },
      { status: 500 }
    );
  }
}
