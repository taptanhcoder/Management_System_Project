// prisma/seed.ts
import "dotenv/config";

import prisma from "./prisma";
import { users, medicines } from "./data";

async function main() {
  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  for (const med of medicines) {
    await prisma.medicine.create({ data: med });
  }

  console.log("✅ Đã seed dữ liệu mẫu!");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
