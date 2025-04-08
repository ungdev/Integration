import { and, count, eq, sql } from "drizzle-orm";
import { userSchema } from "../schemas/Basic/user.schema";
import { permanenceSchema } from "../schemas/Basic/permanence.schema";
import { db } from "../database/db";
import { userPermanenceSchema } from "../schemas/Relational/userpermanences.schema";
import { PgTransaction } from "drizzle-orm/pg-core";

// Classes d'erreurs personnalisées
class UnauthorizedError extends Error {}
class AlreadyRegisteredError extends Error {}
class PermanenceNotFoundError extends Error {}
class PermanenceClosedError extends Error {}
class PermanenceFullError extends Error {}
class UnregisterDeadlineError extends Error {}

export const getPermanenceById = async (permId: number) => {
  const permanence = await db.query.permanenceSchema.findFirst({
    where: eq(permanenceSchema.id, permId),
  });
  if (!permanence) throw new PermanenceNotFoundError("Permanence introuvable");
  return permanence;
};

// ➕ S'inscrire à une permanence
export const registerUserToPermanence = async (userId: number, permId: number) => {

    const user = await db.query.userSchema.findFirst({ where: eq(userSchema.id, userId) });
    if (!user || (user.permission !== "Student" && user.permission !== "Admin")) {
      throw new UnauthorizedError("Unauthorized");
    }
    
      const permanence = await getPermanenceById(permId);
  
      if (!permanence) throw new Error("Permanence not found");
      if (!permanence.is_open) throw new PermanenceClosedError("Permanence not open");

      
      const existing = await db.query.userPermanenceSchema.findFirst({
        where: and(
          eq(userPermanenceSchema.user_id, userId),
          eq(userPermanenceSchema.permanence_id, permId)
        ),
      });
      if (existing) throw new AlreadyRegisteredError("Already registered");
  
      const currentCount = await db
        .select({ count: count() })
        .from(userPermanenceSchema)
        .where(eq(userPermanenceSchema.permanence_id, permId))
        .then((r) => r[0].count);
  
      if (currentCount >= permanence.capacity) throw new PermanenceFullError("Permanence full");

      await db.transaction(async (tx) => {
      // Verrouille la permanence pendant la transaction
        await tx.insert(userPermanenceSchema).values({
            user_id: userId,
            permanence_id: permId,
        });
        })
  
      await modifyPermCap(permId, -1);
  };
  

// ❌ Se désinscrire d'une permanence
export const unregisterUserFromPermanence = async (userId: number, permId: number) => {

  const permanence = await getPermanenceById(permId);
  const now = new Date();
  const limitDate = new Date(permanence.start_at);
  limitDate.setDate(limitDate.getDate() - 1);

  if (now > limitDate) throw new UnregisterDeadlineError("Too late to unregister");

  // Désinscrire l'utilisateur
  await db.delete(userPermanenceSchema).where(
    and(
      eq(userPermanenceSchema.user_id, userId),
      eq(userPermanenceSchema.permanence_id, permId)
    )
  );

  await modifyPermCap(permId, 1);
};

// Vérifier si l'inscription ou la désinscription est possible
const isUnregisterable = (perm: any): boolean => {
  const now = new Date();
  const deadline = new Date(perm.start_at);
  deadline.setDate(deadline.getDate() - 1);
  return now > deadline;
};

// 🔎 Voir toutes les permanences ouvertes
export const listOpenPermanences = async () => {
  return await db.query.permanenceSchema.findMany({
    where: eq(permanenceSchema.is_open, true),
    orderBy: permanenceSchema.start_at,
  });
};

// ➕ Créer une permanence
export const createPermanence = async (
  name: string,
  description: string,
  location: string,
  start_at: Date,
  end_at: Date,
  capacity: number
) => {
  await db.insert(permanenceSchema).values({
    name,
    description,
    location,
    start_at,
    end_at,
    capacity,
    is_open: false, // pas ouverte à la création
  });
};

export const deletePermanence = async (permId : number) => {
    await db.delete(userPermanenceSchema).where(eq(userPermanenceSchema.permanence_id, permId));
    await db.delete(permanenceSchema).where(eq(permanenceSchema.id, permId));
};

export const updatePermanence = async (
    permId: number,
    name: string,
    description: string,
    location: string,
    start_at: Date,
    end_at: Date,
    capacity: number
  ) => {
    await db.update(permanenceSchema).set({
      name,
      description,
      location,
      start_at,
      end_at,
      capacity,
      is_open: false, // pas ouverte à la création
    }).where(eq(permanenceSchema.id, permId));
  };

// Ouvrir une permanence (Admin action)
export const openPermanence = async (permId: number) => {
  await db.update(permanenceSchema)
    .set({ is_open: true })
    .where(eq(permanenceSchema.id, permId));
};

// Fermer une permanence
export const closePermanence = async (permId: number) => {
  await db.update(permanenceSchema)
    .set({ is_open: false })
    .where(eq(permanenceSchema.id, permId));
};

// Modifier la capacité de la permanence
export const modifyPermCap = async (permId: number, factor: number) => {
    const perm = await getPermanenceById(permId);
    const newPermCap = Number(perm.capacity) + factor;
  
    if (newPermCap < 0) throw new Error("Invalid capacity");
    
    await db.update(permanenceSchema).set({ capacity: newPermCap }).where(eq(permanenceSchema.id, permId));
  };
  
  
// Voir ses permanences
export const getMyPermanences = async (userId: number) => {
    return await db
    .select({
      id: permanenceSchema.id,
      name: permanenceSchema.name,
      start_at: permanenceSchema.start_at,
      end_at: permanenceSchema.end_at,
      location: permanenceSchema.location,
    })
    .from(userPermanenceSchema)
    .innerJoin(permanenceSchema, eq(permanenceSchema.id, userPermanenceSchema.permanence_id))
    .where(eq(userPermanenceSchema.user_id, userId));
};

export const getAllPermanences = async () => {
    return await db.select().from(permanenceSchema);
};

export const getUsersInPermanence = async (permId: number) => {
    return await db
    .select({
      userId: userSchema.id,
      firstName: userSchema.first_name,
      lastName: userSchema.last_name,
    })
    .from(userPermanenceSchema)
    .innerJoin(userSchema, eq(userSchema.id, userPermanenceSchema.user_id))
    .where(eq(userPermanenceSchema.permanence_id, permId));
};


export const addUserToPermanence = async (userId: number, permId: number) => {
  
    // Désinscrire l'utilisateur
    await db.insert(userPermanenceSchema).values({
        user_id: userId,
        permanence_id: permId,
      });
    
      await modifyPermCap(permId, -1);
};

export const removeUserToPermanence = async (userId: number, permId: number) => {
  
    await db.delete(userPermanenceSchema).where(
        and(
          eq(userPermanenceSchema.user_id, userId),
          eq(userPermanenceSchema.permanence_id, permId)
        )
      );
    
      await modifyPermCap(permId, 1);
};

