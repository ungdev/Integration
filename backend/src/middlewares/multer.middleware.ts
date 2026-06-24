import { type NextFunction, type Request, type Response } from "express";
import fs from "fs/promises";
import multer from "multer";
import path from "path";
import { Error } from "../utils/responses";
import { isSafeUploadSegment, removeUploadedDocuments } from "../utils/uploadDocuments";

export enum MIMEType {
    PDF = "application/pdf",
    PNG = "image/png",
    JPEG = "image/jpeg",
}

const acceptedMIMETypesByItem: Record<string, Record<string, MIMEType[]>> = {
    foodmenu: {
        menu: [MIMEType.PDF],
    },
    news: {},
    plannings: {
        tc: [MIMEType.PDF],
        bachelor_ia: [MIMEType.PDF],
        fise: [MIMEType.PDF],
        fisea: [MIMEType.PDF],
        master: [MIMEType.PDF],
    },
};

export const createUploadMiddleware = () => {
    // On stocke d'abord en mémoire pour vérifier le type réel
    const storage = multer.memoryStorage();

    const multerUpload = multer({
        storage,
        limits: {
            fileSize: 5 * 1024 * 1024, // 5 Mo
        },
    });

    // Middleware custom pour vérifier et sauvegarder
    const verifyAndSave = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            if (!req.file) return Error(res, { msg: "Aucun fichier reçu" });


            const category = req.params.category;
            const item = req.params.item;

            if (!category || !item) {
                return Error(res, { msg: "Catégorie ou item manquant" });
            }

            if (!isSafeUploadSegment(category) || !isSafeUploadSegment(item)) {
                return Error(res, { msg: "Paramètres invalides" });
            }

            const { originalname, buffer } = req.file;

            // Vérif du vrai type
            const { fileTypeFromBuffer } = await import("file-type");
            const detected = await fileTypeFromBuffer(buffer);

            const detectedMime = detected?.mime as MIMEType | undefined;

            const acceptedTypes = category === "news" ? [MIMEType.PNG, MIMEType.JPEG] : acceptedMIMETypesByItem[category]?.[item];



            if (!acceptedTypes) {
                return Error(res, { msg: "Catégorie ou item inconnu" });
            }

            const isAccepted = !!detectedMime && acceptedTypes.includes(detectedMime);

            if (!isAccepted) {
                Error(res, { msg: "Type de fichier non autorisé" });
                return;
            }

            const uploadPath = path.resolve(process.cwd(), "uploads", category);

            // Création dossier si nécessaire
            await fs.mkdir(uploadPath, { recursive: true });

            if (category === "news") {
                if (!/^\d+$/.test(item)) {
                    return Error(res, { msg: "Le nom du fichier doit être composé uniquement de chiffres." });
                }

                const currentEntries = await fs.readdir(uploadPath);
                if (currentEntries.length >= 100) {
                    return Error(res, { msg: "Le nombre maximal d'images d'actualités a été atteind." });
                }
            }

            // Supprime tout document existant avec le même basename, quelle que soit l'extension.
            await removeUploadedDocuments(category, item);

            const ext = path.extname(originalname);
            const finalName = `${item}${ext}`;

            const finalPath = path.join(uploadPath, finalName);

            // Sauvegarde du fichier sur disque
            await fs.writeFile(finalPath, buffer);

            next();
        } catch (err) {
            next(err);
        }
    };

    return { multerUpload, verifyAndSave };
};
