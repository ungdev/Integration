import api from '../api';

// Fonction pour initier la connexion à Google (ce sera l'API backend qui gérera l'OAuth)
export const exportDb = async () => {
    try {
      const response = await api.post('/export/export');
      return response.data
    } catch (error) {
      alert("Erreur lors de la connexion à Google.");
    }
};