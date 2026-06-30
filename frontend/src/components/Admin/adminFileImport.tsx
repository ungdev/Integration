import { ExternalLink, FilePenLine, FilePlus, FileText, Trash } from 'lucide-react';
import { type ChangeEvent, useCallback, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { MIMEType } from '../../interfaces/import.interface';
import { checkIfExistingDocument, deleteFile, importFile } from '../../services/requests/im_export.service';
import { Card, CardContent } from '../ui/card';

type AdminFileImportProps = {
    category: string;
    item?: string;
    acceptedTypes?: MIMEType[];
    title: string;
    draft?: boolean;
    draftInitialUrl?: string | null;
    onDraftFileChange?: (file: File | null) => void;
    onDraftDelete?: () => void;
    onDraftSubmitReady?: (submit: (itemOverride?: string) => Promise<string | null>) => void;
};

type ExistingFile = {
    exists: boolean;
    extension: string | null;
    fileName: string | null;
    relativePath: string | null;
};

export const AdminFileImport = ({
    category,
    item,
    acceptedTypes = [MIMEType.PDF],
    title,
    draft = false,
    draftInitialUrl,
    onDraftFileChange,
    onDraftDelete,
    onDraftSubmitReady,
}: AdminFileImportProps) => {
    const [existingFile, setExistingFile] = useState<ExistingFile | null>(null);
    const [fileURL, setFileURL] = useState<string | null>(null);
    const [draftFile, setDraftFile] = useState<File | null>(null);
    const [draftPreviewURL, setDraftPreviewURL] = useState<string | null>(null);

    const resolvePublicFileUrl = useCallback((url: string) => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }

        const baseUrl = import.meta.env.VITE_API_URL as string;
        if (url.startsWith('/api/') && baseUrl.endsWith('/api')) {
            return `${baseUrl}${url.slice(4)}`;
        }

        return `${baseUrl}${url}`;
    }, []);

    const getExtensionFromPath = useCallback((url: string) => {
        const cleanUrl = url.split('?')[0].split('#')[0];
        const fileName = cleanUrl.split('/').pop() ?? '';
        if (!fileName.includes('.')) {
            return null;
        }

        return fileName.split('.').pop()?.toLowerCase() ?? null;
    }, []);

    const checkFileStatus = useCallback(async () => {
        if (draft || !item) {
            return;
        }

        try {
            const status = await checkIfExistingDocument(category, item);
            setExistingFile(status);

            if (status.exists && status.relativePath) {
                setFileURL(resolvePublicFileUrl(status.relativePath));
            } else {
                setFileURL(null);
            }
        } catch {
            setExistingFile(null);
            setFileURL(null);
        }
    }, [category, draft, item, resolvePublicFileUrl]);

    useEffect(() => {
        if (!draft || draftFile || draftPreviewURL) {
            return;
        }

        if (!draftInitialUrl) {
            setExistingFile(null);
            setFileURL(null);
            return;
        }

        const resolvedUrl = resolvePublicFileUrl(draftInitialUrl);
        const extension = getExtensionFromPath(draftInitialUrl);
        const fileName = draftInitialUrl.split('?')[0].split('#')[0].split('/').pop() ?? null;

        setExistingFile({
            exists: true,
            extension,
            fileName,
            relativePath: null,
        });
        setFileURL(resolvedUrl);
    }, [draft, draftFile, draftInitialUrl, draftPreviewURL, getExtensionFromPath, resolvePublicFileUrl]);

    useEffect(() => {
        if (!draft) {
            void checkFileStatus();
        }
    }, [checkFileStatus, draft]);

    const submitDraftUpload = useCallback(
        async (itemOverride?: string): Promise<string | null> => {
            if (!draft || !draftFile) {
                return null;
            }

            const targetItem = itemOverride ?? item;

            if (!targetItem) {
                throw new Error("L'item est requis pour la soumission du brouillon.");
            }

            const formData = new FormData();
            formData.append('file', draftFile);

            await importFile(formData, category, targetItem);

            const status = await checkIfExistingDocument(category, targetItem);
            setExistingFile(status);
            if (status.exists && status.relativePath) {
                setFileURL(resolvePublicFileUrl(status.relativePath));
            }

            setDraftFile(null);
            if (draftPreviewURL) {
                URL.revokeObjectURL(draftPreviewURL);
                setDraftPreviewURL(null);
            }
            onDraftFileChange?.(null);

            return status.relativePath ?? null;
        },
        [category, draft, draftFile, draftPreviewURL, item, onDraftFileChange, resolvePublicFileUrl],
    );

    useEffect(() => {
        if (draft && onDraftSubmitReady) {
            onDraftSubmitReady(submitDraftUpload);
        }
    }, [draft, onDraftSubmitReady, submitDraftUpload]);

    const inputId = `${category}-${item ?? 'draft'}-fileInput`;

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Aucun fichier sélectionné',
            });
            return;
        }

        const selected = e.target.files[0];
        if (!selected || !acceptedTypes.includes(selected.type as MIMEType)) {
            Swal.fire({
                icon: 'error',
                title: 'Format incompatible',
                text: "Le fichier sélectionné n'est pas autorisé pour ce champ.",
            });
            return;
        }

        if (draft) {
            const extension = selected.name.includes('.')
                ? (selected.name.split('.').pop()?.toLowerCase() ?? null)
                : null;

            if (draftPreviewURL) {
                URL.revokeObjectURL(draftPreviewURL);
            }
            const localPreviewURL = URL.createObjectURL(selected);

            setDraftFile(selected);
            setExistingFile({
                exists: true,
                extension,
                fileName: selected.name,
                relativePath: null,
            });
            setDraftPreviewURL(localPreviewURL);
            setFileURL(localPreviewURL);
            onDraftFileChange?.(selected);
            return;
        }

        if (!item) {
            Swal.fire({
                icon: 'error',
                title: 'Configuration invalide',
                text: "L'item est requis pour l'upload direct.",
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', selected);

            const response = await importFile(formData, category, item);
            await checkFileStatus();
            await Swal.fire('✅ Import réussi', response.message, 'success');
        } catch (err) {
            console.error("Erreur lors de l'importation du menu", err);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: "Erreur lors de l'importation du menu.",
            });
        }
    };

    const handleDelete = async () => {
        if (draft) {
            if (draftPreviewURL) {
                URL.revokeObjectURL(draftPreviewURL);
            }
            setDraftFile(null);
            setDraftPreviewURL(null);
            setExistingFile(null);
            setFileURL(null);
            onDraftFileChange?.(null);
            onDraftDelete?.();
            return;
        }

        if (!item) {
            return;
        }

        const confirm = await Swal.fire({
            title: `Supprimer le document ${title} ?`,
            text: 'Cette action est irreversible.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#d33',
            confirmButtonText: '🚍 Oui',
            cancelButtonText: 'Annuler',
        });

        if (confirm.isConfirmed) {
            try {
                const response = await deleteFile(category, item);
                await checkFileStatus();
                await Swal.fire('✅ Suppression réussie', response.message, 'success');
            } catch (err) {
                console.error('Erreur lors de la suppression du document', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Erreur lors de la suppression du document.',
                });
            }
        }
    };

    return (
        <Card className="w-full max-w-7xl mx-auto gap-3">
            <CardContent>
                <div className="flex flex-wrap items-center justify-between">
                    <div className="flex flex-wrap items-center space-x-3">
                        <h2 className="text-lg font-semibold">{title}</h2>

                        <div className="flex items-center space-x-2">
                            {existingFile?.exists ? (
                                <>
                                    <FileText className="w-5 h-5 text-green-500" />
                                    <p className="text-gray-500">.{existingFile?.extension}</p>
                                </>
                            ) : (
                                <FileText className="w-5 h-5 text-red-500" />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center space-x-1">
                        <input
                            id={inputId}
                            type="file"
                            accept={acceptedTypes.join(',')}
                            // accept={extensions.map(ext => `${ext}`).join(",")}
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <label
                            htmlFor={inputId}
                            className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-2 rounded shadow-md transition-all duration-200">
                            {existingFile?.exists ? (
                                <FilePenLine className="w-5 h-5 text-white" />
                            ) : (
                                <FilePlus className="w-5 h-5 text-white" />
                            )}
                        </label>

                        {(existingFile?.exists || !!draftPreviewURL) && (
                            <>
                                {(draftPreviewURL || fileURL) && (
                                    <a
                                        href={draftPreviewURL ?? fileURL ?? '#'}
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        <button className="cursor-pointer p-2 transition-all duration-200 hover:bg-gray-100 rounded">
                                            <ExternalLink className="w-5 h-5 text-blue-500" />
                                        </button>
                                    </a>
                                )}

                                <button
                                    onClick={handleDelete}
                                    className="cursor-pointer p-2 transition-all duration-200 hover:bg-gray-100 rounded">
                                    <Trash className="w-5 h-5 text-red-500" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
