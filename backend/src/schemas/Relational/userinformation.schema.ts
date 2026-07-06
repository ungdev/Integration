import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { userSchema } from "../Basic/user.schema";

export const userinformationSchema = pgTable("userinformations", {
    user_id: integer("user_id").primaryKey().references(() => userSchema.id, { onDelete: "cascade" }),
    urgency_contact_name: text("urgency_contact_name"),
    urgency_contact_phone: integer("urgency_contact_phone"),
});

export type UserInformation = typeof userinformationSchema.$inferSelect;