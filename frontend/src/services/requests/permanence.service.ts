import api from "../api"; // ton instance axios ou une autre bibliothèque pour les requêtes HTTP

// Fonction pour récupérer toutes les permanences ouvertes
export const getOpenPermanences = async () => {

    const response = await api.get("/permanence/user/permanences");
    return response.data.data; // La réponse est de type PermanenceResponse

};

// Fonction pour récupérer toutes les permanences (admin)
export const getAllPermanences = async () => {

    const response = await api.get("/permanence/admin/permanences");
    return response.data; // La réponse est de type PermanenceResponse

};

// Fonction pour s'inscrire à une permanence (étudiant)
export const applyToPermanence = async (permId: number) => {

    const response = await api.post(`/permanence/user/apply`, {permId});
    return response.data; // La réponse est de type ApplyPermanenceResponse

};

// Fonction pour créer une nouvelle permanence (admin)
export const createPermanence = async (permanenceData: {
  name: string;
  description: string;
  location: string;
  start_at: string;
  end_at: string;
  capacity: number;
  difficulty : number;
  respoId: number | null;
}) => {

    const response = await api.post("/permanence/admin/permanence", {
      name: permanenceData.name,
      description: permanenceData.description,
      location: permanenceData.location,
      start_at: permanenceData.start_at,
      end_at: permanenceData.end_at,
      capacity: permanenceData.capacity,
      difficulty : permanenceData.difficulty,
      respoId : permanenceData.respoId
    });
    return response.data; // La réponse est de type Permanent

};

// Fonction pour ouvrir une permanence (admin)
export const openPermanence = async (permId: number) => {

    const response = await api.post("/permanence/admin/open", {
      permId,
    });
    return response.data; // La réponse est de type Permanent

};


// Fonction pour fermer une permanence (admin)
export const closePermanence = async (permId: number) => {

    const response = await api.post(`/permanence/admin/close`, {permId});
    return response.data;

};

export const cancelPermanence = async (permId: number) => {

      const response = await api.post(`/permanence/user/leave`, { permId });
      return response.data;

};

  export const getMyPermanences = async () => {

      const response = await api.get(`/permanence/user/me`);
      return response.data.data; 

};

export const updatePermanence = async ( permId: number, permanenceData: {

    name: string;
    description: string;
    location: string;
    start_at: string;
    end_at: string;
    capacity: number;
    difficulty : number;
    respoId: number | null;
  }) => {

      const response = await api.post("/permanence/admin/updatepermanence", {
        permId,
        name: permanenceData.name,
        description: permanenceData.description,
        location: permanenceData.location,
        start_at: permanenceData.start_at,
        end_at: permanenceData.end_at,
        capacity: permanenceData.capacity,
        difficulty: permanenceData.difficulty,
        respoId : permanenceData.respoId
      });
      return response.data; // La réponse est de type Permanent

};

export const getUsersByPermanence = async(permId: number) =>{ 

        const response =  await api.get(`/permanence/admin/users`, {params : {permId}});
        return response.data;

};

export const addUserToPermanence = async(permId: number, userId: number) => {

        const response = await api.post(`/permanence/admin/add`, { userId, permId });
        return response.data;

};

export const removeUserFromPermanence = async(permId: number, userId: number) => {

        const response = await api.post(`/permanence/admin/remove`, { userId, permId });
        return response.data;

}

export const deletePermanence = async(permId: number) =>{ 

        const response =  await api.delete(`/permanence/admin/permanence`, {params : {permId}});
        return response.data;

};

export const importPermanenceCSV = async(formData : FormData) => {

      const response = await api.post(`/permanence/admin/importpermanences`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },});
      return response.data;

}

export const isUserRespo = async(userId : number) => {

      const response = await api.get(`/permanence/user/isrespo`,  {params : {userId}});
      return response.data;

}

export const respoDetails = async() => {

      const response = await api.get(`/permanence/respo/respodetails`);
      return response.data;

}

export const claimedMember = async (userId: number, permId: number, claimed : boolean) => {
  const response = await api.post(`/permanence/respo/claimedmember`, {
    userId,
    permId,
    claimed
  });
  return response.data;
};



