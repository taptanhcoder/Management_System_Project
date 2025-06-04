// src/app/api/catalog/categories/[categoryId]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateCategorySchema = z.object({
  name: z.string(),
  description: z.string(),
});

export async function GET(request: Request, { params }: { params: { categoryId: string } }) {
  const { categoryId } = params;
  try {
    const cat = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { drugs: true },
    });
    if (!cat) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(cat);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Cannot fetch category" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { categoryId: string } }) {
  const { categoryId } = params;
  try {
    const existing = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!existing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    const json = await request.json();
    const data = updateCategorySchema.parse(json);

    const updated = await prisma.category.update({
      where: { id: categoryId },
      data: { name: data.name, description: data.description },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    if (
      err.code === "P2002" &&
      Array.isArray(err.meta?.target) &&
      err.meta.target.includes("name")
    ) {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 400 }
      );
    }
    console.error(err);
    return NextResponse.json({ error: "Cannot update category" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { categoryId: string } }) {
  const { categoryId } = params;
  try {
    const childCount = await prisma.drug.count({ where: { categoryId } });
    if (childCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete category: it still has drugs." },
        { status: 400 }
      );
    }
    await prisma.category.delete({ where: { id: categoryId } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Cannot delete category" }, { status: 500 });
  }
}
