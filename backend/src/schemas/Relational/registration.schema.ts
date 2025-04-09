import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { userSchema } from "../Basic/user.schema";

export const registrationSchema = pgTable("registration_tokens", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => userSchema.id).notNull(),
  token: text("token").unique().notNull(),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export type RegistrationToken = typeof registrationSchema.$inferSelect;
