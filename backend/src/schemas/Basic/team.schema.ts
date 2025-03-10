import { pgTable, serial, text } from "drizzle-orm/pg-core";

// Définition de la table `integration_teams`
export const teamSchema = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").unique(),  // Le nom de l'équipe
  description: text("description"),  // Description de l'équipe
});

export type IntegrationTeam = typeof teamSchema.$inferSelect;
