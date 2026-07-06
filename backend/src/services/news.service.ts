import { db } from '../prisma/db';

type NewsUpdateFields = Partial<{
    title: string | null;
    description: string | null;
    type: string | null;
    published: boolean | null;
    target: string | null;
    image_url: string | null;
}>;

// Créer une actu
export const createNews = async (
    title: string,
    description: string,
    type: string,
    published: boolean,
    target: string,
    image_url?: string
) => {
    return await db.news.create({
        data: { title, description, type, published, target, image_url }
    });
};

// Lister les actus
export const getAllNews = async () => {
    return await db.news.findMany({ orderBy: { created_at: 'desc' } });
};

// Lister les actus publiées (pour l'onglet côté utilisateur)
export const getPublishedNews = async () => {
    return await db.news.findMany({
        where: { published: true },
        orderBy: { created_at: 'desc' }
    });
};

// Filtrer par type
export const getPublishedNewsByType = async (type: string) => {
    return await db.news.findMany({
        where: { published: true, type },
        orderBy: { created_at: 'desc' }
    });
};

// Publier une actu
export const publishNews = async (id: number) => {
    await db.news.update({ where: { id }, data: { published: true } });
};

// Dépublier une actu
export const deleteNews = async (newsId: number) => {
    await db.news.delete({ where: { id: newsId } });
};

// Mettre à jour une actu
export const updateNews = async (id: number, updates: NewsUpdateFields) => {
    const result = await db.news.update({ where: { id }, data: updates });
    return result ?? null;
};

// Récupérer une actu par son ID
export const getNewsById = async (id: number) => {
    const result = await db.news.findUnique({ where: { id } });
    return result ?? null;
};
