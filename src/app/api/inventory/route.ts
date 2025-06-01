// src/app/api/inventory/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema validate cho body khi tạo mới thuốc
const createDrugSchema = z.object({
  name: z.string(),
  categoryId: z.string(),
  quantity: z.number().int().nonnegative(),
  expiryDate: z.string(), // ISO date string: "YYYY-MM-DD"
  supplier: z.string(),
  purchasePrice: z.number().nonnegative(),
  sellingPrice: z.number().nonnegative(),
  description: z.string().optional(),
});

export async function GET() {
  try {
    const all = await prisma.drug.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json(
      { error: "Cannot fetch inventory" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = createDrugSchema.parse(json);

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
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Cannot create drug" },
      { status: 500 }
    );
  }
}
