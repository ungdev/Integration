import api from "../api";

// Créer une tente (binôme)
export const createTent = async (userId2: number) => {
    const response = await api.post("/tent/user/tent", { userId2 });
    return response.data;
};

// Annuler une tente
export const cancelTent = async () => {
    const response = await api.delete("/tent/user/tent",);
    return response.data;
};

// Récupérer la tente d'un utilisateur
export const getUserTent = async () => {
    const response = await api.get(`/tent/user/tent`);
    return response.data;
};

// Récupérer tous les binômes (admin)
export const getAllTentPairs = async () => {
    const response = await api.get("/tent/admin/tents");
    return response.data;
};

// Valider ou dévalider une tente (admin)
export const toggleTentConfirmation = async (
    userId1: number,
    userId2: number,
    confirmed: boolean
) => {
    const response = await api.post("/tent/admin/toggleconfirmation", {
        userId1,
        userId2,
        confirmed,
    });
    return response.data;
};
