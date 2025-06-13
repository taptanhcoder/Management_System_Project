// src/lib/inventory.ts
import { Prisma } from "@prisma/client";

export async function deductInventory(
  tx: Prisma.TransactionClient,
  items: { drugId: string; quantity: number }[]
) {
  for (const it of items) {
    const d = await tx.drug.findUnique({ where: { id: it.drugId } });
    if (!d) throw new Error(`Drug ${it.drugId} không tồn tại`);
    if (d.quantity < it.quantity) {
      throw new Error(`Không đủ tồn kho thuốc ${it.drugId}`);
    }
    await tx.drug.update({
      where: { id: it.drugId },
      data: { quantity: { decrement: it.quantity } },
    });
  }
}
