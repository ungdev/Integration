import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { Request, Response, NextFunction } from "express";
import { fileTypeFromBuffer } from "file-type";
import { Error } from "../utils/responses";

export const createUploadMiddleware = (
  relativeUploadDir: string,
  modifiedName: boolean = true
  ) => {
  const uploadPath = path.resolve(process.cwd(), relativeUploadDir);

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
    next: NextFunction
  ) => {
    try {
      if (!req.file) return Error(res, {msg: "Aucun fichier reçu"});

      const user = (req as Request).user?.userId || "anonymous";
      const { originalname, mimetype, buffer } = req.file;

      console.log(
        `[UPLOAD] User: ${user}, File: ${originalname}, Mimetype annoncé: ${mimetype}`
      );

      // Vérif du vrai type
      const detected = await fileTypeFromBuffer(buffer);
      console.log(
        `[UPLOAD] Type détecté: ${detected?.mime || "inconnu"}`
      );

      const isImage = detected?.mime?.startsWith("image/");
      const isPDF = detected?.mime === "application/pdf";

      if (!isImage && !isPDF) {
        return Error(res,{ msg:"Seules les images et les PDF sont autorisés"});
      }

      // Création dossier si nécessaire
      await fs.mkdir(uploadPath, { recursive: true });

      const ext = path.extname(originalname);
      const baseName = path.basename(originalname, ext);
      const timestamp = Date.now();
      const finalName = modifiedName
        ? `${baseName}-${timestamp}${ext}`
        : originalname;

      const finalPath = path.join(uploadPath, finalName);

      // Sauvegarde du fichier sur disque
      await fs.writeFile(finalPath, buffer);

      // On rajoute le chemin pour les middlewares suivants
      (req as any).savedFilePath = finalPath;

      next();
    } catch (err) {
      next(err);
    }
  };

  return { multerUpload, verifyAndSave };
};
