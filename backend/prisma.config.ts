import { defineConfig } from "prisma/config";
import { join } from 'node:path';
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: join('prisma'),
  migrations: {
    path: join('prisma', 'migrations'),
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.OUTSIDE_DATABASE_URL ?? "",
  },
});
