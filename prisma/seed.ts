import { Role, PrescriptionStatus, InvoiceStatus } from "@prisma/client";
import { prisma } from "../src/lib/prisma";
import {
  usersData,
  categoriesData,
  drugsData,
  customersData,
  prescriptionsData,
  prescriptionItemsData,
  invoicesData,
  invoiceItemsData,
} from "../src/lib/data";

async function main() {
  console.log(" Starting seeding...");

  const userMap = new Map<string, string>();
  for (const u of usersData) {
    const created = await prisma.user.create({
      data: {
        email: u.email,
        passwordHash: u.passwordHash,
        name: u.name ?? null,
        role: u.role as Role,
      },
    });
    userMap.set(u.email, created.id);
  }

  const categoryMap = new Map<string, string>();
  for (const c of categoriesData) {
    const created = await prisma.category.create({
      data: {
        name: c.name,
        description: c.description,
      },
    });
    categoryMap.set(c.name, created.id);
  }

  const drugMap = new Map<string, string>();
  for (const d of drugsData) {
    const categoryId = categoryMap.get(d.categoryId) || d.categoryId;
    const created = await prisma.drug.create({
      data: {
        name: d.name,
        categoryId: categoryId,
        quantity: d.quantity,
        expiryDate: d.expiryDate,
        supplier: d.supplier,
        purchasePrice: d.purchasePrice,
        sellingPrice: d.sellingPrice,
        description: d.description ?? null,
      },
    });
    drugMap.set(d.name, created.id);
  }

  const customerMap = new Map<string, string>();
  for (const c of customersData) {
    const created = await prisma.customer.create({
      data: {
        name: c.name,
        phone: c.phone,
        email: c.email,
        address: c.address,
        notes: c.notes ?? null,
      },
    });
    customerMap.set(c.name, created.id);
  }

  const prescriptionMap = new Map<string, string>();
  for (const pr of prescriptionsData) {
    const createdById = pr.createdById
      ? userMap.get(pr.createdById) || null
      : null;
    const created = await prisma.prescription.create({
      data: {
        customer: pr.customer,
        date: pr.date,
        status: pr.status as PrescriptionStatus,
        total: pr.total,
        createdById: createdById,
      },
    });
    prescriptionMap.set(pr.customer + pr.date.toISOString(), created.id);
  }

  for (const pi of prescriptionItemsData) {
    const prescriptionId =
      prescriptionMap.get(pi.prescriptionId) || pi.prescriptionId;
    const drugId = drugMap.get(pi.drugId) || pi.drugId;
    await prisma.prescriptionItem.create({
      data: {
        prescriptionId: prescriptionId,
        drugId: drugId,
        quantity: pi.quantity,
        unitPrice: pi.unitPrice,
      },
    });
  }

  const invoiceMap = new Map<string, string>();
  for (const iv of invoicesData) {
    const customerId = customerMap.get(iv.customerId) || iv.customerId;
    const createdById = iv.createdById
      ? userMap.get(iv.createdById) || null
      : null;
    const created = await prisma.invoice.create({
      data: {
        customerId: customerId,
        date: iv.date,
        status: iv.status as InvoiceStatus,
        total: iv.total,
        createdById: createdById,
      },
    });
    invoiceMap.set(customerId + iv.date.toISOString(), created.id);
  }

  for (const ii of invoiceItemsData) {
    const invoiceId =
      invoiceMap.get(ii.invoiceId) || ii.invoiceId;
    const drugId = drugMap.get(ii.drugId) || ii.drugId;
    await prisma.invoiceItem.create({
      data: {
        invoiceId: invoiceId,
        drugId: drugId,
        quantity: ii.quantity,
        unitPrice: ii.unitPrice,
      },
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(" Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
