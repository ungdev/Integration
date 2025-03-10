import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

export default {
  schema: "./src/schemas/*",
  out: "./drizzle",
  dialect: "postgresql",  // Assurez-vous de spécifier "postgresql" ici si le projet attend cette valeur
  driver: "pglite",  // Vous pouvez essayer "pglite" si c'est le type attendu par `drizzle-kit`
  dbCredentials: {
    url: process.env.OUTSIDE_DATABASE_URL ?? "", // Valeur par défaut si non défini
  },
} satisfies Config;
