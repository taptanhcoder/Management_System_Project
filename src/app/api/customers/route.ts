// src/app/api/customers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createCustomerSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  address: z.string(),
  notes: z.string().optional(),
});

export async function GET() {
  try {
    const list = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json(
      { error: "Cannot fetch customers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data = createCustomerSchema.parse(json);

    const newCus = await prisma.customer.create({ data });
    return NextResponse.json(newCus, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Cannot create customer" },
      { status: 500 }
    );
  }
}
