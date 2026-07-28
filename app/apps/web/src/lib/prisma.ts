import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const databaseUrl = withConnectionLimit(process.env.DATABASE_URL);
if (databaseUrl) process.env.DATABASE_URL = databaseUrl;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.PRISMA_LOG === "true" ? ["query", "error", "warn"] : ["error"]
  });

globalForPrisma.prisma = prisma;

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function withConnectionLimit(url?: string) {
  if (!url) return url;

  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has("connection_limit")) {
      parsed.searchParams.set("connection_limit", "1");
    }
    return parsed.toString();
  } catch {
    return url;
  }
}
