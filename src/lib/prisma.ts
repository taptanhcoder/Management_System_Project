// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client';

declare global {
  // In development, use a global variable so we reuse the PrismaClient instance across module reloads
  // In production, this variable will be undefined and PrismaClient will be instantiated once per process
  var prisma: PrismaClient | undefined;
}

const prismaClient = global.prisma
  ?? new PrismaClient({
    log:
      process.env.NODE_ENV === 'production'
        ? ['warn', 'error']
        : ['query', 'info', 'warn', 'error'],
  });

// If not in production, save the instance to the global object
// so that later imports reuse the same PrismaClient (avoiding too many connections)
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaClient;
}

export default prismaClient;
