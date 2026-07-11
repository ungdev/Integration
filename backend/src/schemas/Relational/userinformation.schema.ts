import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { userSchema } from "../Basic/user.schema";

export const userInformationSchema = pgTable("user_informations", {
    user_id: integer("user_id").primaryKey().references(() => userSchema.id, { onDelete: "cascade" }),
    urgency_contact_name: text("urgency_contact_name"),
    urgency_contact_phone: integer("urgency_contact_phone"),
    contact_CE: text("contact_CE"),
});

export type UserInformation = typeof userInformationSchema.$inferSelect;