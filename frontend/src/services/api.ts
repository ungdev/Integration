import axios, { AxiosError, AxiosResponse } from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Intercepteur de requête : Ajoute le token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken")?.trim();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur de réponse : Gestion des erreurs globales
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            console.warn("🔑 Token expiré ou invalide, redirection...");
            window.location.replace("/");
        }
        return Promise.reject(error);
    }
);

// 🔧 Utilitaire pour extraire data.data et gérer les erreurs
export const handleApiResponse = async <T>(
    request: Promise<AxiosResponse<{ data: T }>>
): Promise<T> => {
    try {
        const response = await request;
        return response.data.data;
    } catch (error: any) {
        const message = error?.response?.data?.message || error.message || "Erreur API";
        console.error("❌ API Error:", message);
        throw new Error(message);
    }
};

export default api;
