// src/app/api/invoices/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createInvoiceSchema = z.object({
  prescriptionId: z.string().optional(),
  customerId: z.string().optional(),
  customerName: z.string().optional(),
  date: z.coerce.date(),
  status: z.enum(["PAID", "UNPAID"]).default("UNPAID"),
  items: z
    .array(
      z.object({
        drugId: z.string(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().nonnegative(),
      })
    )
    .optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const skip = (page - 1) * limit;

  try {
    const [data, total] = await Promise.all([
      prisma.invoice.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { customer: { select: { id: true, name: true } } },
      }),
      prisma.invoice.count(),
    ]);
    return NextResponse.json({ data, meta: { total, page, limit } });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Cannot fetch invoices" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      prescriptionId,
      customerId: explicitId,
      customerName,
      date,
      status,
      items,
    } = createInvoiceSchema.parse(await request.json());

    const inv = await prisma.$transaction(async (tx) => {
      let custId: string | null = explicitId ?? null;

      // 1) Nếu có prescriptionId thì resolve sang Customer bằng tên
      if (prescriptionId) {
        const pres = await tx.prescription.findUnique({
          where: { id: prescriptionId },
          include: { items: true },
        });
        if (!pres) throw new Error("Prescription không tồn tại");
        if (pres.status === "CONFIRMED") throw new Error("Đơn đã được confirm");

        const name = pres.customer; // tên gốc lưu trong Prescription.customer
        const byName = await tx.customer.findFirst({ where: { name } });
        if (byName) {
          custId = byName.id;
        } else {
          // tạo mới Customer với email tạm
          const email = `guest-pres-${prescriptionId}@pharmacy.local`;
          const newC = await tx.customer.create({
            data: { name, email, phone: "", address: "" },
          });
          custId = newC.id;
        }
      }

      // 2) Nếu không có custId nhưng có customerName (walk-in)
      if (!custId && customerName) {
        const name = customerName.trim();
        const exist = await tx.customer.findFirst({ where: { name } });
        if (exist) {
          custId = exist.id;
        } else {
          const email = `guest-${Date.now()}@pharmacy.local`;
          const newC = await tx.customer.create({
            data: { name, email, phone: "", address: "" },
          });
          custId = newC.id;
        }
      }

      // 3) Nếu explicitId vẫn tồn, dùng luôn
      if (!custId && explicitId) custId = explicitId;

      if (!custId) {
        throw new Error(
          "Phải cung cấp prescriptionId, customerId hoặc customerName"
        );
      }

      // 4) Xác định items (ưu tiên payload, fallback lấy trong Prescription)
      let invoiceItems = items;
      if (
        prescriptionId &&
        (!invoiceItems || invoiceItems.length === 0)
      ) {
        const pres = await tx.prescription.findUnique({
          where: { id: prescriptionId },
          include: { items: true },
        });
        invoiceItems = pres!.items.map((it) => ({
          drugId: it.drugId,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
        }));
      }
      if (!invoiceItems || invoiceItems.length === 0) {
        throw new Error("Không có items để tạo hóa đơn");
      }

      // 5) Tính total
      const total = invoiceItems.reduce(
        (sum, it) => sum + it.quantity * it.unitPrice,
        0
      );

      // 6) Tạo hóa đơn + items
      const created = await tx.invoice.create({
        data: {
          customerId: custId,
          date,
          status,
          total,
          items: { create: invoiceItems },
        },
        include: { items: true },
      });

      // 7) Nếu đã PAID thì trừ kho & confirm Prescription
      if (status === "PAID") {
        for (const it of created.items) {
          const d = await tx.drug.findUnique({ where: { id: it.drugId } });
          if (!d || d.quantity < it.quantity)
            throw new Error(`Không đủ tồn kho thuốc ${it.drugId}`);
          await tx.drug.update({
            where: { id: it.drugId },
            data: { quantity: d.quantity - it.quantity },
          });
        }
        if (prescriptionId) {
          await tx.prescription.update({
            where: { id: prescriptionId },
            data: { status: "CONFIRMED" },
          });
        }
      }

      return created;
    });

    return NextResponse.json(inv, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: err.message || "Cannot create invoice" },
      { status: 400 }
    );
  }
}
