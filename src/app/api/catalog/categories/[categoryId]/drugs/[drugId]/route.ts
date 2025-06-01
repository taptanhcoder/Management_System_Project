// src/app/api/catalog/categories/[categoryId]/drugs/[drugId]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateDrugSchema = z.object({
  name: z.string(),
  quantity: z.number().int().nonnegative(),
  expiryDate: z.string(),
  supplier: z.string(),
  purchasePrice: z.number().nonnegative(),
  sellingPrice: z.number().nonnegative(),
  description: z.string().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { categoryId: string; drugId: string } }
) {
  const { drugId } = params;
  try {
    const drug = await prisma.drug.findUnique({ where: { id: drugId } });
    if (!drug) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(drug);
  } catch (error) {
    return NextResponse.json(
      { error: "Cannot fetch drug" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { categoryId: string; drugId: string } }
) {
  const { drugId } = params;
  try {
    const json = await request.json();
    const data = updateDrugSchema.parse(json);

    const updated = await prisma.drug.update({
      where: { id: drugId },
      data: {
        name: data.name,
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
    return NextResponse.json(
      { error: "Cannot update drug" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { categoryId: string; drugId: string } }
) {
  const { drugId } = params;
  try {
    await prisma.drug.delete({ where: { id: drugId } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Cannot delete drug" },
      { status: 500 }
    );
  }
}
