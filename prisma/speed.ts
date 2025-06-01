
import { Prisma, UserRole, GenderEnum, PrescriptionStatus, OrderStatus } from '@prisma/client';
import prisma from '../src/lib/prisma';
import {
  usersData,
  doctorProfilesData,
  patientProfilesData,
  pharmaciesData,
  medicinesData,
  batchesData,
  inventoryData,
  prescriptionsData,
  prescriptionDetailsData,
  ordersData,
  orderDetailsData,
} from '../src/lib/data';

async function main() {
  // 1. Seed Users
  for (const u of usersData) {
    await prisma.user.create({
      data: {
        full_name: u.full_name,
        email: u.email,
        phone: u.phone,
        role: u.role as UserRole,
        password: u.password,
        created_at: u.created_at,
      },
    });
  }

  // 2. Seed Doctors
  for (const d of doctorProfilesData) {
    await prisma.doctor.create({
      data: {
        user_id: d.user_id,
        specialization: d.specialization ?? null,
        license_number: d.license_number ?? null,
      },
    });
  }

  // 3. Seed Patients
  for (const p of patientProfilesData) {
    await prisma.patient.create({
      data: {
        user_id: p.user_id,
        date_of_birth: p.date_of_birth,
        gender: p.gender as GenderEnum,
        medical_history: p.medical_history,
      },
    });
  }

  // 4. Seed Pharmacies
  for (const ph of pharmaciesData) {
    await prisma.pharmacy.create({
      data: {
        user_id: ph.user_id,
        address: ph.address,
        license_number: ph.license_number,
      },
    });
  }

  // 5. Seed Medicines
  await prisma.medicine.createMany({
    data: medicinesData.map((m) => ({
      name: m.name,
      description: m.description ?? null,
      price: m.price,
    })),
    skipDuplicates: true,
  });

  // 6. Seed Batches
  for (const b of batchesData) {
    await prisma.medicineBatch.create({
      data: {
        medicine_id: b.medicine_id,
        batch_number: b.batch_number,
        expiration_date: b.expiration_date,
        stock: b.stock,
      },
    });
  }

  // 7. Seed Inventory
  for (const inv of inventoryData) {
    await prisma.inventory.create({
      data: {
        pharmacy_id: inv.pharmacy_id,
        batch_id: inv.batch_id,
        stock_quantity: inv.stock_quantity,
      },
    });
  }

  // 8. Seed Prescriptions
  for (const pr of prescriptionsData) {
    await prisma.prescription.create({
      data: {
        doctor_id: pr.doctor_id,
        patient_id: pr.patient_id,
        pharmacy_id: pr.pharmacy_id,
        created_at: pr.created_at,
        status: pr.status as PrescriptionStatus,
      },
    });
  }

  // 9. Seed PrescriptionDetails
  for (const d of prescriptionDetailsData) {
    await prisma.prescriptionDetail.create({
      data: {
        prescription_id: d.prescription_id,
        medicine_id: d.medicine_id,
        dosage: d.dosage ?? null,
        instructions: d.instructions ?? null,
        quantity: d.quantity,
      },
    });
  }

  // 10. Seed Orders
  for (const o of ordersData) {
    await prisma.order.create({
      data: {
        patient_id: o.patient_id,
        pharmacy_id: o.pharmacy_id,
        total_price: o.total_price,
        order_date: o.order_date,
        status: o.status as OrderStatus,
      },
    });
  }

  // 11. Seed OrderDetails
  for (const od of orderDetailsData) {
    await prisma.orderDetail.create({
      data: {
        order_id: od.order_id,
        medicine_id: od.medicine_id,
        quantity: od.quantity,
        price: od.price,
      },
    });
  }

  console.log('✅ Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
