import multer from "multer";
import path from "path";
import fs from "fs";

// Dossier de destination
const uploadPath = path.join(__dirname, "../../uploads/imgnews");

// Crée le dossier s’il n’existe pas
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configuration du storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}-${timestamp}${ext}`);
  },
});

// Filtrer les types de fichiers (optionnel)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {

  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images sont autorisées"));
  }
};

// Final middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Mo
  },
});

export default upload;
