import multer from "multer";
import path from "path";
import fs from "fs/promises";

export const createUploadMiddleware = (
  relativeUploadDir: string,
  modifiedName: boolean = true
) => {
  // On construit le chemin absolu à partir de la racine du projet
  const uploadPath = path.resolve(process.cwd(), relativeUploadDir);

  const storage = multer.diskStorage({
    destination: async (_req, _file, cb) => {
      try {
        // Création du dossier si nécessaire (async + recursive)
        await fs.mkdir(uploadPath, { recursive: true });
        cb(null, uploadPath);
      } catch (err) {
        cb(err as Error, uploadPath);
      }
    },
    filename: (_req, file, cb) => {
      if (modifiedName) {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        cb(null, `${baseName}-${timestamp}${ext}`);
      } else {
        cb(null, file.originalname);
      }
    },
  });

  const fileFilter = (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const isImage = file.mimetype.startsWith("image/");
    const isPDF = file.mimetype === "application/pdf";

    if (isImage || isPDF) {
      cb(null, true);
    } else {
      cb(new Error("Seules les images et les PDF sont autorisés"));
    }
  };

  const limits = {
    fileSize: 5 * 1024 * 1024, // 5 Mo
  };

  return multer({ storage, fileFilter, limits });
};
