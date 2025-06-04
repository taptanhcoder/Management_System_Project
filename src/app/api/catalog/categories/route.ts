// src/app/api/catalog/categories/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string(),
  description: z.string(),
});

export async function GET() {
  try {
    const cats = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(cats);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Cannot fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = createCategorySchema.parse(json);

    const cat = await prisma.category.create({ data });
    return NextResponse.json(cat, { status: 201 });
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
    return NextResponse.json({ error: "Cannot create category" }, { status: 500 });
  }
}
