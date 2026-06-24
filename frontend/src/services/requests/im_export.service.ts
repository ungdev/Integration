import api from "../api";

type ExistingDocumentStatus = {
    exists: boolean;
    extension: string | null;
    fileName: string | null;
    relativePath: string | null;
};

// Fonction export
export const exportDb = async () => {
    const response = await api.post('/imexport/admin/exportgsheet');
    return response.data;
};

// Fonction import
export const importFile = async (formData: FormData, category: string, item: string) => {
    const response = await api.post(`/imexport/admin/import/${category}/${item}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const exportBus = async () => {
    const response = await api.get('/imexport/admin/exportbus');
    return response.data;
};

export const checkIfExistingDocument = async (category: string, item: string) => {
    const response = await api.get('/imexport/admin/document/' + category + '/' + item);
    return response.data.data as ExistingDocumentStatus;
};

export const deleteFile = async (category: string, item: string) => {
    const response = await api.delete('/imexport/admin/document/' + category + '/' + item);
    return response.data;
};
