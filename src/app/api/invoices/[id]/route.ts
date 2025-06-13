// src/app/api/invoices/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { deductInventory } from "@/lib/inventory";

const updateInvoiceSchema = z.object({
  customerId: z.string(),
  date: z.coerce.date(),
  status: z.enum(["PAID", "UNPAID"]).optional(),
  items: z.array(
    z.object({
      id: z.string().optional(),
      drugId: z.string(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().nonnegative(),
    })
  ),
});

export async function PUT(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  const data = updateInvoiceSchema.parse(await request.json());

  return await prisma.$transaction(async (tx) => {
    // 1. Fetch old invoice
    const oldInv = await tx.invoice.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!oldInv) throw new Error("Invoice không tồn tại");

    // 2. Delete old items
    await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });

    // 3. Recalculate total and update
    const total = data.items.reduce(
      (sum, it) => sum + it.quantity * it.unitPrice,
      0
    );
    const updated = await tx.invoice.update({
      where: { id },
      data: {
        customerId: data.customerId,
        date: data.date,
        status: data.status,
        total,
        items: {
          create: data.items.map((it) => ({
            drugId: it.drugId,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
          })),
        },
      },
      include: { items: true },
    });

    // 4. Deduct stock when marking PAID (only once)
    if (data.status === "PAID" && oldInv.status !== "PAID") {
      await deductInventory(
        tx,
        updated.items.map((it) => ({
          drugId: it.drugId,
          quantity: it.quantity,
        }))
      );
    }

    return NextResponse.json(updated);
  });
}
