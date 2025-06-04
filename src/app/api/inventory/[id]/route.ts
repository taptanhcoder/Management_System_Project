// src/app/api/inventory/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema cho PUT (update toàn bộ thông tin)
const updateDrugSchema = z.object({
  name: z.string(),
  categoryId: z.string(),
  quantity: z.number().int().nonnegative(),
  expiryDate: z.string(), // "YYYY-MM-DD"
  supplier: z.string(),
  purchasePrice: z.number().nonnegative(),
  sellingPrice: z.number().nonnegative(),
  description: z.string().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const drug = await prisma.drug.findUnique({
      where: { id },
      include: { category: { select: { id: true, name: true } } },
    });
    if (!drug) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    // Tính status tương tự như ở GET all
    const today = new Date();
    let status = "OK";
    if (drug.quantity === 0) status = "OUT_OF_STOCK";
    else if (drug.expiryDate < today) status = "EXPIRED";
    else if (
      new Date(drug.expiryDate).getTime() <=
      today.getTime() + EXPIRY_SOON_DAYS * 24 * 60 * 60 * 1000
    )
      status = "EXPIRING_SOON";
    else if (drug.quantity < LOW_STOCK_THRESHOLD) status = "LOW_STOCK";

    return NextResponse.json({
      id: drug.id,
      name: drug.name,
      category: { id: drug.category.id, name: drug.category.name },
      quantity: drug.quantity,
      expiryDate: drug.expiryDate,
      supplier: drug.supplier,
      purchasePrice: drug.purchasePrice,
      sellingPrice: drug.sellingPrice,
      description: drug.description,
      status,
      createdAt: drug.createdAt,
      updatedAt: drug.updatedAt,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Cannot fetch drug" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const json = await request.json();
    const data = updateDrugSchema.parse(json);

    const updated = await prisma.drug.update({
      where: { id },
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
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Cannot update drug" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    await prisma.drug.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Cannot delete drug" }, { status: 500 });
  }
}

// Hằng số chia sẻ (nếu muốn sử dụng lại)
const LOW_STOCK_THRESHOLD = 10;
const EXPIRY_SOON_DAYS = 7;
