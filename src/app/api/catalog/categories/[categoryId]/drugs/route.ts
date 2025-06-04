// src/app/api/catalog/categories/[categoryId]/drugs/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createDrugInCategorySchema = z.object({
  name: z.string(),
  quantity: z.number().int().nonnegative(),
  expiryDate: z.string(),
  supplier: z.string(),
  purchasePrice: z.number().nonnegative(),
  sellingPrice: z.number().nonnegative(),
  description: z.string().optional(),
});

export async function GET(request: Request, { params }: { params: { categoryId: string } }) {
  const { categoryId } = params;
  try {
    const cat = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!cat) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    const drugs = await prisma.drug.findMany({
      where: { categoryId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(drugs);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Cannot fetch drugs" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { categoryId: string } }) {
  const { categoryId } = params;
  try {
    const cat = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!cat) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    const json = await request.json();
    const data = createDrugInCategorySchema.parse(json);

    const newDrug = await prisma.drug.create({
      data: {
        name: data.name,
        category: { connect: { id: categoryId } },
        quantity: data.quantity,
        expiryDate: new Date(data.expiryDate),
        supplier: data.supplier,
        purchasePrice: data.purchasePrice,
        sellingPrice: data.sellingPrice,
        description: data.description,
      },
    });
    return NextResponse.json(newDrug, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Cannot create drug" }, { status: 500 });
  }
}
