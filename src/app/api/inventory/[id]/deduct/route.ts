// === src/app/api/inventory/[id]/deduct/route.ts ===
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const deductSchema = z.object({ quantity: z.number().int().positive() });

export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  const { quantity } = deductSchema.parse(await req.json());
  const drug = await prisma.drug.findUnique({ where: { id } });
  if (!drug) return NextResponse.json({ error: "Drug not found" }, { status: 404 });
  if (drug.quantity < quantity) return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
  const updated = await prisma.drug.update({ where: { id }, data: { quantity: drug.quantity - quantity } });
  return NextResponse.json(updated);
}
