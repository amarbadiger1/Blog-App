import { PrismaClient } from "@prisma/client/extension";

const prismaClientSinglton = () => {
  return new PrismaClient();
};

const globalForprisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForprisma.prisma ?? prismaClientSinglton();

export default prisma;

if (process.env.NOTDE_ENV !== "production") globalForprisma.prisma = prisma;
