import { defineConfig } from 'drizzle-kit'
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "./src/schemas/*",
  out: "./src/database/migrations",
  dialect:"postgresql",
  dbCredentials: {
    url: process.env.OUTSIDE_DATABASE_URL ?? ""
  },
});
