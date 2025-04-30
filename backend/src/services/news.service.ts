// src/services/actus.service.ts
import { db } from "../database/db";
import { News, newsSchema } from "../schemas/Basic/news.schema";
import { eq, desc, and } from "drizzle-orm";
import * as user_service from './user.service';
import * as email_service from './email.service';
// Créer une actu
export const createNews =  async (
  title: string,
  description: string,
  type: string,
  published: boolean,
  target: string
) => {
  const newNews = {
    title,
    description,
    type,
    published,
    target,
  };

  const result = await db.insert(newsSchema).values(newNews).returning();
  return result[0];
};

// Lister les actus
export const getAllNews = async () => {
  return await db.select().from(newsSchema).orderBy(desc(newsSchema.created_at));
};

// Lister les actus publiées (pour l’onglet côté utilisateur)
export const getPublishedNews = async () => {
  return await db.select().from(newsSchema).where(eq(newsSchema.published, true)).orderBy(desc(newsSchema.created_at));
};

// Filtrer par type
export const getPublishedNewsByType = async (type: string) => {
  return await db.select().from(newsSchema)
    .where(and(eq(newsSchema.published, true),eq(newsSchema.type, type)))
    .orderBy(desc(newsSchema.created_at));
};

// Publier une actu
export const publishNewsandNotify = async (id: number) => {

  await db.update(newsSchema).set({ published : true }).where(eq(newsSchema.id, id)).returning();

};

export const deleteNews = async(newsId: number) => {

  await db.delete(newsSchema).where(eq(newsSchema.id, newsId));

}

export const updateNews = async (
  id: number,
  updates: Partial<News>
) => {
  const result = await db
    .update(newsSchema)
    .set(updates)
    .where(eq(newsSchema.id, id))
    .returning();

  return result[0] ?? null;
};

