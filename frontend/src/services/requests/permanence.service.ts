import api from "../api"; // ton instance axios ou une autre bibliothèque pour les requêtes HTTP

// Fonction pour récupérer toutes les permanences ouvertes
export const getOpenPermanences = async () => {
  try {
    const response = await api.get("/permanence/student/permanences");
    return response.data.data; // La réponse est de type PermanenceResponse
  } catch (error : any) {
    return error.response.data;
  }
};

// Fonction pour récupérer toutes les permanences (admin)
export const getAllPermanences = async () => {
  try {
    const response = await api.get("/permanence/admin/permanences");
    return response.data; // La réponse est de type PermanenceResponse
  } catch (error : any) {
    return error.response.data;
  }
};

// Fonction pour s'inscrire à une permanence (étudiant)
export const applyToPermanence = async (permId: number) => {
  try {
    const response = await api.post(`/permanence/student/apply`, {permId});
    return response.data; // La réponse est de type ApplyPermanenceResponse
  } catch (error : any) {
    return error.response.data;
  }
};

// Fonction pour créer une nouvelle permanence (admin)
export const createPermanence = async (permanenceData: {
  name: string;
  description: string;
  location: string;
  start_at: string;
  end_at: string;
  capacity: number;
}) => {
  try {
    const response = await api.post("/permanence/admin/permanence", {
      name: permanenceData.name,
      description: permanenceData.description,
      location: permanenceData.location,
      start_at: permanenceData.start_at,
      end_at: permanenceData.end_at,
      capacity: permanenceData.capacity,
    });
    return response.data; // La réponse est de type Permanent
  } catch (error : any) {
    return error.response.data;
  }
};

// Fonction pour ouvrir une permanence (admin)
export const openPermanence = async (permId: number) => {
  try {
    const response = await api.post("/permanence/admin/open", {
      permId,
    });
    return response.data; // La réponse est de type Permanent
  } catch (error : any) {
    return error.response.data;
  }
};


// Fonction pour fermer une permanence (admin)
export const closePermanence = async (permId: number) => {
  try {
    const response = await api.post(`/permanence/admin/close`, {permId});
    return response.data;
  } catch (error : any) {
    return error.response.data;
  }
};

export const cancelPermanence = async (permId: number) => {
    try {
      const response = await api.post(`/permanence/student/leave`, { permId });
      return response.data;
    } catch (error : any) {
      return error.response.data;
    }
};

  export const getMyPermanences = async () => {
    try {
      const response = await api.get(`/permanence/student/me`);
      return response.data.data; 
    } catch (error : any) {
        return error.response.data;
    }
};

export const updatePermanence = async ( permId: number, permanenceData: {

    name: string;
    description: string;
    location: string;
    start_at: string;
    end_at: string;
    capacity: number;
  }) => {
    try {
      const response = await api.post("/permanence/admin/updatepermanence", {
        permId,
        name: permanenceData.name,
        description: permanenceData.description,
        location: permanenceData.location,
        start_at: permanenceData.start_at,
        end_at: permanenceData.end_at,
        capacity: permanenceData.capacity,
      });
      return response.data; // La réponse est de type Permanent
    } catch (error : any) {
      return error.response.data;
    }
};

export const getUsersByPermanence = async(permId: number) =>{ 
    try{
        const response =  await api.get(`/permanence/admin/users`, {params : {permId}});
        return response.data;
    }catch( error : any ){
        console.log(error);
        return error.response.data;
    }
};

export const addUserToPermanence = async(permId: number, userId: number) => {
    try{
        const response = await api.post(`/permanence/admin/add`, { userId, permId });
        return response.data;
    }catch(error : any){
        return error.response.data;
    }
};

export const removeUserFromPermanence = async(permId: number, userId: number) => {
    try{
        const response = await api.post(`/permanence/admin/remove`, { userId, permId });
        return response.data;
    }catch(error :any){
        return error.response.data;
    }
}

export const deletePermanence = async(permId: number) =>{ 
    try{
        const response =  await api.delete(`/permanence/admin/permanence`, {params : {permId}});
        return response.data;
    }catch( error : any ){
        console.log(error);
        return error.response.data;
    }
};

