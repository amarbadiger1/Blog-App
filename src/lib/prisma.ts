import { PrismaClient } from "@prisma/client";

const prismaClientSinglton = () => {
  return new PrismaClient();
};

const globalForprisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForprisma.prisma ?? prismaClientSinglton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForprisma.prisma = prisma;
