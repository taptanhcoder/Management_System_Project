// src/lib/prisma.ts

import { PrismaClient } from "@prisma/client";

declare global {
  // Trong môi trường dev, tránh tạo nhiều PrismaClient instance
  // @ts-ignore
  var prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  // Nếu global.prisma đã tồn tại (trong dev), tái sử dụng; ngược lại khởi tạo mới
  // @ts-ignore
  global.prisma ||
  new PrismaClient({
    log: ["query"], // nếu muốn in log các query ra console
  });

if (process.env.NODE_ENV !== "production") {
  // @ts-ignore
  global.prisma = prisma;
}
