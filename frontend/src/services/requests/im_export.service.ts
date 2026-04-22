import api from "../api";

// Fonction export
export const exportDb = async () => {
    const response = await api.post('/imexport/admin/exportgsheet');
    return response.data;
};

// Fonction import
export const importFoodMenu = async (formData: FormData) => {
    const response = await api.post('/imexport/admin/foodimport', formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const importPlannings = async (formData: FormData) => {
    const response = await api.post('/imexport/admin/plannings', formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const exportBus = async () => {
    const response = await api.get('/imexport/admin/exportbus');
    return response.data;
};
