import 'dotenv/config';
import prisma from './prisma';
import { faker } from '@faker-js/faker';
import { user_role } from '@prisma/client';

async function main() {
  console.log('🌱 Đang seed dữ liệu mẫu...');

  // Seed medicines
  for (let i = 0; i < 10; i++) {
    await prisma.medicine.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 5000, max: 100000 })),
      },
    });
  }

  // Seed users & gán vào từng vai trò
  for (let i = 0; i < 15; i++) {
    const user = await prisma.user.create({
      data: {
        full_name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: '09' + faker.string.numeric(8),

        role: user_role.doctor,
        password: '123456',
      },
    });

    await prisma.doctor.create({
      data: {
        user_id: user.user_id,
        specialization: faker.person.jobType(),
        license_number: faker.string.alphanumeric(10),
      },
    });
  }

  for (let i = 0; i < 15; i++) {
    const user = await prisma.user.create({
      data: {
        full_name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: '09' + faker.string.numeric(8),

        role: user_role.patient,
        password: '123456',
      },
    });

    await prisma.patient.create({
      data: {
        user_id: user.user_id,
        gender: faker.helpers.arrayElement(['male', 'female', 'other']),
        date_of_birth: faker.date.birthdate({ min: 18, max: 90, mode: 'age' }),
        medical_history: faker.lorem.sentence(),
      },
    });
  }

  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        full_name: faker.company.name(),
        email: faker.internet.email(),
        phone: '09' + faker.string.numeric(8),
        role: user_role.pharmacy,
        password: '123456',
      },
    });

    await prisma.pharmacy.create({
      data: {
        user_id: user.user_id,
        address: faker.location.streetAddress(),
        license_number: faker.string.alphanumeric(10),
      },
    });
  }

  console.log('✅ Đã seed xong toàn bộ!');
}

main()
  .catch((e) => {
    console.error('❌ Seed lỗi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
