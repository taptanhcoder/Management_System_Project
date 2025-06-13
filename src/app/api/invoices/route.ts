// File: src/app/api/invoices/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schema validate input cho POST
const createInvoiceSchema = z.object({
  prescriptionId: z.string().optional(),
  customerId: z.string().optional(),
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

// GET /api/invoices?page=…&limit=…
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

// POST /api/invoices
export async function POST(request: Request) {
  try {
    // 1. Parse & validate body
    const json = await request.json();
    const { prescriptionId, customerId: explicitCustId, date, status, items } =
      createInvoiceSchema.parse(json);

    // 2. Run in transaction
    const inv = await prisma.$transaction(async (tx) => {
      // a) Xác định customerId
      let custId = explicitCustId ?? "";
      if (prescriptionId) {
        const pres = await tx.prescription.findUnique({
          where: { id: prescriptionId },
          include: { items: true },
        });
        if (!pres) throw new Error("Prescription không tồn tại");
        if (pres.status === "CONFIRMED") throw new Error("Đơn đã được confirm");

        // pres.customer là chuỗi ban đầu (khi tạo Prescription, bạn đã lưu Customer.id tại đây)
        const candidate = pres.customer;

        // Kiểm tra xem đúng là một Customer.id
        const foundById = await tx.customer.findUnique({ where: { id: candidate } });
        if (foundById) {
          custId = foundById.id;
        } else {
          // fallback: tìm theo name (nếu bạn lưu tên khách)
          const foundByName = await tx.customer.findFirst({ where: { name: candidate } });
          if (foundByName) {
            custId = foundByName.id;
          } else {
            throw new Error(`Không tìm thấy khách hàng tương ứng với Prescription`);
          }
        }
      }

      if (!custId) throw new Error("customerId bắt buộc nếu không dùng prescription");

      // b) Xác định items
      let invoiceItems = items;
      if (prescriptionId) {
        // tái sử dụng pres.items nếu lấy từ đơn
        const presItems = (await tx.prescription.findUnique({
          where: { id: prescriptionId },
          include: { items: true },
        }))!.items;
        invoiceItems = presItems.map((it) => ({
          drugId: it.drugId,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
        }));
      }
      if (!invoiceItems?.length) throw new Error("Không có items để tạo hóa đơn");

      // c) Tính total
      const total = invoiceItems.reduce(
        (sum, it) => sum + it.quantity * it.unitPrice,
        0
      );

      // d) Tạo invoice + items
      const created = await tx.invoice.create({
        data: {
          customerId: custId,
          date,
          status,
          total,
          items: {
            create: invoiceItems.map((it) => ({
              drugId: it.drugId,
              quantity: it.quantity,
              unitPrice: it.unitPrice,
            })),
          },
        },
        include: { items: true },
      });

      // e) Nếu PAID, trừ kho và confirm prescription
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

    // 3. Trả về hoá đơn mới tạo
    return NextResponse.json(inv, { status: 201 });
  } catch (err: any) {
    // Zod validation errors
    if (err instanceof z.ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    // Bất kỳ lỗi nào khác cũng trả JSON
    return NextResponse.json(
      { error: err.message || "Cannot create invoice" },
      { status: 400 }
    );
  }
}
