import api from "../api";

// Créer une tente (binôme)
export const createTent = async (userId2: number) => {
  const response = await api.post("/tent/user/tent", { userId2 });
  return response.data;
};

// Annuler une tente
export const cancelTent = async () => {
  const response = await api.delete("/tent/user/tent", );
  return response.data;
};

// Récupérer la tente d’un utilisateur
export const getUserTent = async () => {
  const response = await api.get(`/tent/user/tent`);
  return response.data;
};

// Récupérer tous les binômes (admin)
export const getAllTentPairs = async () => {
  const response = await api.get("/tent/admin/tents");
  return response.data;
};