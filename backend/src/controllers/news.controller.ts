import { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import * as email_service from '../services/email.service';
import { generateEmailHtml } from '../services/email.service';
import * as news_service from '../services/news.service';
import * as user_service from '../services/user.service';
import { Error, Ok } from '../utils/responses';
import { email_from } from '../utils/secret';

const toStoredUploadPath = (imageUrl: string) => {
    if (!imageUrl) {
        return null;
    }

    let normalized = imageUrl.trim();
    if (!normalized) {
        return null;
    }

    // Accept absolute URLs and keep only the pathname part.
    if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
        try {
            normalized = new URL(normalized).pathname;
        } catch {
            return null;
        }
    }

    if (normalized.startsWith('/api/')) {
        normalized = normalized.slice(4);
    }

    if (!normalized.startsWith('/uploads/')) {
        return null;
    }

    return normalized;
};

const resolveStoredImagePath = (imageUrl: string) => {
    const storedPath = toStoredUploadPath(imageUrl);
    if (!storedPath) {
        return null;
    }

    return path.resolve(process.cwd(), storedPath.replace(/^\//, ''));
};

const deleteImageIfExists = (imageUrl: string) => {
    const imagePath = resolveStoredImagePath(imageUrl);
    if (!imagePath) {
        return;
    }

    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
};

export const createNews = async (req: Request, res: Response) => {
    const { title, description, type, published, target, image_url } = req.body;
    const file = req.file;

    try {
        const resolvedImageUrl = file ? `/uploads/news/${file.filename}` : image_url;

        const news = await news_service.createNews(
            title,
            description,
            type,
            published === true || published === 'true',
            target,
            resolvedImageUrl,
        );
        Ok(res, { msg: 'Actu créée avec succès', data: news });
    } catch (err) {
        console.error(err);
        Error(res, { msg: "Erreur lors de la création de l'actu" });
    }
};

export const listAllNews = async (_req: Request, res: Response) => {
    try {
        const news = await news_service.getAllNews();
        Ok(res, { data: news });
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de la récupération des actus' });
    }
};

export const listPublishedNews = async (_req: Request, res: Response) => {
    try {
        const news = await news_service.getPublishedNews();
        Ok(res, { data: news });
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de la récupération des actus publiées' });
    }
};

export const listPublishedNewsByType = async (req: Request, res: Response) => {
    const { type } = req.query;

    try {
        const news = await news_service.getPublishedNewsByType(type as string);
        Ok(res, { data: news });
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de la récupération des actus par type' });
    }
};

export const publishNews = async (req: Request, res: Response) => {
    const { id, sendEmail } = req.body;

    try {
        await news_service.publishNews(id);

        const news = await news_service.getNewsById(Number(id));
        if (sendEmail) {
            const html = generateEmailHtml('templateNotifyNews', { title: news.title });

            if (!html) {
                Error(res, { msg: 'Template de notification introuvable.' });
                return;
            }

            const recipients =
                news.target === 'Tous'
                    ? (await user_service.getUsersAdmin()).map((u) => u.email)
                    : (await user_service.getUsersbyPermission(news.target)).map((u) => u.email);

            if (recipients.length === 0) {
                Error(res, { msg: 'No recipients' });
            }

            const email = {
                from: email_from,
                to: [],
                subject: `[INTEGRATION UTT] Nouvelle actu : ${news.title}`,
                html: html,
                cc: [],
                bcc: recipients,
            };

            await email_service.sendEmail(email);
        }

        Ok(res, { msg: 'Actu publiée' });
    } catch (err) {
        console.error(err);
        Error(res, { msg: 'Erreur lors de la publication ou de la notification' });
    }
};

export const deleteNews = async (req: Request, res: Response) => {
    const { newsId } = req.query;

    try {
        const existing = await news_service.getNewsById(Number(newsId));
        if (existing?.image_url) {
            deleteImageIfExists(existing.image_url);
        }

        await news_service.deleteNews(Number(newsId));
        Ok(res, { msg: 'Actus supprimée avec succès !' });
    } catch (err) {
        console.error(err);
        Error(res, { msg: "Erreur lors de la suppression de l'actus" });
    }
};

export const updateNews = async (req: Request, res: Response) => {
    const { id, title, description, type, target, image_url } = req.body;
    const file = req.file;
    const hasImageUrlField = Object.prototype.hasOwnProperty.call(req.body, 'image_url');
    const resolvedImageUrl = file
        ? `/uploads/news/${file.filename}`
        : hasImageUrlField
          ? (image_url ?? null)
          : undefined;

    try {
        const existing = await news_service.getNewsById(Number(id));
        if (!existing) {
            Error(res, { msg: 'Actu introuvable' });
            return;
        }

        const shouldReplaceImage = typeof resolvedImageUrl === 'string';
        const shouldRemoveImage = resolvedImageUrl === null;

        // Supprimer l'ancienne image si elle est remplacée ou explicitement supprimée.
        if (
            existing.image_url &&
            ((shouldReplaceImage && existing.image_url !== resolvedImageUrl) || shouldRemoveImage)
        ) {
            deleteImageIfExists(existing.image_url);
        }

        const updates: {
            title: string;
            description: string;
            type: string;
            target: string;
            image_url?: string | null;
        } = { title, description, type, target };
        if (resolvedImageUrl !== undefined) {
            updates.image_url = resolvedImageUrl;
        }

        const updated = await news_service.updateNews(Number(id), updates);

        Ok(res, { msg: 'Actu mise à jour avec succès', data: updated });
    } catch (err) {
        console.error(err);
        Error(res, { msg: "Erreur lors de la mise à jour de l'actu" });
    }
};
