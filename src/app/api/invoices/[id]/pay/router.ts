// src/app/api/invoices/[id]/pay/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { deductInventory } from "@/lib/inventory";

const paySchema = z.object({
  prescriptionId: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params: { id } }: { params: { id: string } }
) {
  const { prescriptionId } = paySchema.parse(await request.json());

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Kiểm tra nếu có prescriptionId, chỉ deduct khi pres.status === PENDING
      let shouldDeduct = true;
      if (prescriptionId) {
        const pres = await tx.prescription.findUnique({
          where: { id: prescriptionId },
        });
        if (!pres) throw new Error("Prescription không tồn tại");
        if (pres.status === "CONFIRMED") {
          shouldDeduct = false;
        }
      }

      // 2. Xác nhận invoice
      const inv = await tx.invoice.update({
        where: { id },
        data: { status: "PAID" },
        include: { items: true },
      });

      // 3. Deduct stock nếu cần
      if (shouldDeduct) {
        await deductInventory(
          tx,
          inv.items.map((it) => ({
            drugId: it.drugId,
            quantity: it.quantity,
          }))
        );
      }

      // 4. Confirm prescription nếu có
      if (prescriptionId) {
        await tx.prescription.update({
          where: { id: prescriptionId },
          data: { status: "CONFIRMED" },
        });
      }

      return inv;
    });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
