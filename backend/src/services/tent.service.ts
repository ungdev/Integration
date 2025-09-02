import { db } from "../database/db";
import { and, eq, or } from "drizzle-orm";
import { userTentSchema } from "../schemas/Relational/usertent.schema";
import { userSchema } from "../schemas/Basic/user.schema";
import { alias } from "drizzle-orm/pg-core";

/**
 * Créer une réservation de tente entre 2 utilisateurs.
 */
export const createTent = async (userId1: number, userId2: number) => {
  if (userId1 === userId2) {
    throw new Error("Impossible de réserver une tente avec soi-même.");
  }

  // Vérifier si l'un des deux a déjà une tente
  const existing = await db
    .select()
    .from(userTentSchema)
    .where(
      or(
        eq(userTentSchema.user_id_1, userId1),
        eq(userTentSchema.user_id_2, userId1),
        eq(userTentSchema.user_id_1, userId2),
        eq(userTentSchema.user_id_2, userId2)
      )
    );

  if (existing.length > 0) {
    throw new Error("Un des utilisateurs a déjà une tente.");
  }

  return await db.insert(userTentSchema).values({
    user_id_1: userId1,
    user_id_2: userId2,
  });
};

/**
 * Annuler une tente (par l'un ou l'autre des utilisateurs).
 */
export const cancelTent = async (userId1: number) => {

  return await db
    .delete(userTentSchema)
    .where(
        or(eq(userTentSchema.user_id_1, userId1), eq(userTentSchema.user_id_2, userId1)),
    );
};

/**
 * Récupérer la tente d’un utilisateur.
 */
export const getTentByUser = async (userId: number) => {
  return await db
    .select()
    .from(userTentSchema)
    .where(or(eq(userTentSchema.user_id_1, userId), eq(userTentSchema.user_id_2, userId)));
};

/**
 * Récupérer toutes les tentes (avec infos des 2 utilisateurs).
 */
export const getAllTents = async () => {
    
  const user2 = alias(userSchema, "user2");

  return await db
    .select({
      user1_id: userTentSchema.user_id_1,
      user2_id: userTentSchema.user_id_2,
      user1_first_name: userSchema.first_name,
      user1_last_name: userSchema.last_name,
      user1_email: userSchema.email,
      user1_majeur: userSchema.majeur,
      user2_first_name: user2.first_name,
      user2_last_name: user2.last_name,
      user2_email: user2.email,
      user2_majeur: user2.majeur,
      confirmed: userTentSchema.confirmed
    })
    .from(userTentSchema)
    .innerJoin(userSchema, eq(userTentSchema.user_id_1, userSchema.id))
    .innerJoin(user2, eq(userTentSchema.user_id_2, user2.id));
};

/**
 * Met à jour la confirmation(avec infos des 2 utilisateurs).
 */
export const toggleTentConfirmation = async (
  userId1: number,
  userId2: number,
  confirmed: boolean
) => {
  if (userId1 === userId2) {
    throw new Error("Les deux utilisateurs doivent être différents.");
  }

  // Vérifier si la tente existe
  const existingTent = await db
    .select()
    .from(userTentSchema)
    .where(
      or(
        and(
          eq(userTentSchema.user_id_1, userId1),
          eq(userTentSchema.user_id_2, userId2)
        ),
        and(
          eq(userTentSchema.user_id_1, userId2),
          eq(userTentSchema.user_id_2, userId1)
        )
      )
    );

  if (existingTent.length === 0) {
    throw new Error("La tente entre ces deux utilisateurs n'existe pas.");
  }

  // Mettre à jour la confirmation
  await db
    .update(userTentSchema)
    .set({ confirmed })
    .where(
      or(
        and(
          eq(userTentSchema.user_id_1, userId1),
          eq(userTentSchema.user_id_2, userId2)
        ),
        and(
          eq(userTentSchema.user_id_1, userId2),
          eq(userTentSchema.user_id_2, userId1)
        )
      )
    );

  return { success: true, message: confirmed ? "Tente validée." : "Tente dévalidée." };
};

