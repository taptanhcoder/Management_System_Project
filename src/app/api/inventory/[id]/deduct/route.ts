// src/app/api/inventory/[id]/deduct/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const deductSchema = z.object({
  quantity: z.number().int().positive(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const json = await req.json();
    const { quantity } = deductSchema.parse(json);

    const drug = await prisma.drug.findUnique({ where: { id } });
    if (!drug) {
      return NextResponse.json({ error: "Drug not found" }, { status: 404 });
    }

    const today = new Date();
    if (drug.expiryDate < today) {
      return NextResponse.json(
        { error: "Cannot sell expired drug" },
        { status: 400 }
      );
    }
    if (drug.quantity < quantity) {
      return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
    }

    const updated = await prisma.drug.update({
      where: { id },
      data: { quantity: drug.quantity - quantity },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Cannot deduct drug" }, { status: 500 });
  }
}
