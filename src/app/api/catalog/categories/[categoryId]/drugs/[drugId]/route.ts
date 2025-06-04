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

export async function GET(request: Request, { params }: { params: { categoryId: string; drugId: string } }) {
  const { categoryId, drugId } = params;
  try {
    const cat = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!cat) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    const drug = await prisma.drug.findUnique({ where: { id: drugId } });
    if (!drug || drug.categoryId !== categoryId) {
      return NextResponse.json({ error: "Drug not found in this category" }, { status: 404 });
    }
    return NextResponse.json(drug);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Cannot fetch drug" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { categoryId: string; drugId: string } }) {
  const { categoryId, drugId } = params;
  try {
    const cat = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!cat) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    const existingDrug = await prisma.drug.findUnique({ where: { id: drugId } });
    if (!existingDrug || existingDrug.categoryId !== categoryId) {
      return NextResponse.json({ error: "Drug not found in this category" }, { status: 404 });
    }

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
    console.error(err);
    return NextResponse.json({ error: "Cannot update drug" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { categoryId: string; drugId: string } }) {
  const { categoryId, drugId } = params;
  try {
    const cat = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!cat) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    const existingDrug = await prisma.drug.findUnique({ where: { id: drugId } });
    if (!existingDrug || existingDrug.categoryId !== categoryId) {
      return NextResponse.json({ error: "Drug not found in this category" }, { status: 404 });
    }

    await prisma.drug.delete({ where: { id: drugId } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    if (error.code === "P2003" || error.code === "P2025") {
      return NextResponse.json(
        { error: "Cannot delete drug: it is referenced elsewhere." },
        { status: 400 }
      );
    }
    console.error(error);
    return NextResponse.json({ error: "Cannot delete drug" }, { status: 500 });
  }
}
