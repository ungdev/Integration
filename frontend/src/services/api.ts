import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur de requête : Ajoute le token aux requêtes sortantes
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

// Intercepteur de réponse : Gestion des erreurs (ex: déconnexion)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("🔑 Token expiré ou invalide, redirection...");
      window.location.replace("/"); // Évite un rechargement complet
    }
    return Promise.reject(error);
  }
);

export default api; // Corrige l'export
