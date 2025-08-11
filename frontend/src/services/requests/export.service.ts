import api from '../api';

// Fonction pour initier la connexion à Google (ce sera l'API backend qui gérera l'OAuth)
export const exportDb = async () => {

      const response = await api.post('/export/admin/export');
      return response.data

};