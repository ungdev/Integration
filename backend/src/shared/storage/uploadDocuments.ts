import fs from "fs/promises";
import path from "path";

export type UploadedDocument = {
    name: string;
    fullPath: string;
    extension: string | null;
    mtimeMs: number;
};

export type UploadedDocumentStatus = {
    exists: boolean;
    extension: string | null;
    fileName: string | null;
    relativePath: string | null;
};

export const isSafeUploadSegment = (value: string) => /^[a-zA-Z0-9_-]+$/.test(value);

export const getUploadDirectory = (category: string) => path.resolve(process.cwd(), "uploads", category);

export const findUploadedDocuments = async (category: string, item: string): Promise<UploadedDocument[]> => {
    const uploadsDir = getUploadDirectory(category);

    const entries = await fs.readdir(uploadsDir);
    const candidates = entries.filter((name) => path.parse(name).name === item);

    return Promise.all(
        candidates.map(async (name) => {
            const fullPath = path.join(uploadsDir, name);
            const stats = await fs.stat(fullPath);

            return {
                name,
                fullPath,
                extension: path.extname(name).replace(/^\./, "").toLowerCase() || null,
                mtimeMs: stats.mtimeMs,
            };
        })
    );
};

export const getLatestUploadedDocument = async (
    category: string,
    item: string,
): Promise<UploadedDocument | null> => {
    const documents = await findUploadedDocuments(category, item);

    if (documents.length === 0) {
        return null;
    }

    documents.sort((a, b) => b.mtimeMs - a.mtimeMs);
    return documents[0];
};

export const removeUploadedDocuments = async (category: string, item: string): Promise<number> => {
    const documents = await findUploadedDocuments(category, item);

    await Promise.all(documents.map((document) => fs.unlink(document.fullPath)));

    return documents.length;
};

export const toUploadedDocumentStatus = (
    category: string,
    document: UploadedDocument | null,
): UploadedDocumentStatus => {
    if (!document) {
        return {
            exists: false,
            extension: null,
            fileName: null,
            relativePath: null,
        };
    }

    return {
        exists: true,
        extension: document.extension,
        fileName: document.name,
        relativePath: `/uploads/${category}/${document.name}`,
    };
};
