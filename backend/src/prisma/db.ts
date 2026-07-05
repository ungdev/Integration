import { PrismaClient } from "./build/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { postgres_db, postgres_host, postgres_password, postgres_port, postgres_user } from "../utils/secret";

const connectionString = `postgresql://${postgres_user}:${postgres_password}@${postgres_host}:${postgres_port}/${postgres_db}`;

// Singleton pattern to counter hot-reloading issues in development
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const db =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter: new PrismaPg({
            connectionString,
        })
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = db;
}