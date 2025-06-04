// src/app/api/inventory/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema cho POST (create or restock)
const createOrRestockSchema = z.object({
  name: z.string(),
  categoryId: z.string(),
  quantity: z.number().int().nonnegative(),
  expiryDate: z.string(), 
  supplier: z.string(),
  purchasePrice: z.number().nonnegative(),
  sellingPrice: z.number().nonnegative(),
  description: z.string().optional(),
});

const LOW_STOCK_THRESHOLD = 10;
const EXPIRY_SOON_DAYS = 7;

export async function GET() {
  try {
    // Lấy tất cả thuốc, kèm category
    const all = await prisma.drug.findMany({
      include: { category: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    // Tính status
    const today = new Date();
    const soonDate = new Date();
    soonDate.setDate(today.getDate() + EXPIRY_SOON_DAYS);

    const result = all.map((d) => {
      let status = "OK";
      if (d.quantity === 0) status = "OUT_OF_STOCK";
      else if (d.expiryDate < today) status = "EXPIRED";
      else if (d.expiryDate <= soonDate) status = "EXPIRING_SOON";
      else if (d.quantity < LOW_STOCK_THRESHOLD) status = "LOW_STOCK";

      return {
        id: d.id,
        name: d.name,
        category: { id: d.category.id, name: d.category.name },
        quantity: d.quantity,
        expiryDate: d.expiryDate,
        supplier: d.supplier,
        purchasePrice: d.purchasePrice,
        sellingPrice: d.sellingPrice,
        description: d.description,
        status,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Cannot fetch inventory" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = createOrRestockSchema.parse(json);

    // Kiểm tra xem đã có thuốc cùng name + categoryId chưa
    const existing = await prisma.drug.findFirst({
      where: {
        name: data.name,
        categoryId: data.categoryId,
      },
    });

    if (existing) {
      // RESTOCK: cộng quantity, update expiryDate nếu lô mới muộn hơn
      const newExpiry = new Date(data.expiryDate);
      const currentExpiry = existing.expiryDate;
      const finalExpiry =
        newExpiry.getTime() > currentExpiry.getTime() ? newExpiry : currentExpiry;

      const updated = await prisma.drug.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + data.quantity,
          expiryDate: finalExpiry,
          supplier: data.supplier,
          purchasePrice: data.purchasePrice,
          sellingPrice: data.sellingPrice,
          description: data.description,
        },
      });
      return NextResponse.json(updated, { status: 200 });
    } else {
      // TẠO MỚI
      const created = await prisma.drug.create({
        data: {
          name: data.name,
          category: { connect: { id: data.categoryId } },
          quantity: data.quantity,
          expiryDate: new Date(data.expiryDate),
          supplier: data.supplier,
          purchasePrice: data.purchasePrice,
          sellingPrice: data.sellingPrice,
          description: data.description,
        },
      });
      return NextResponse.json(created, { status: 201 });
    }
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Cannot create or restock drug" }, { status: 500 });
  }
}
