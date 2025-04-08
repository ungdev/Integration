import api from "../api";

// Récupérer tous les challenges (utilisateur ou admin, en fonction du token)
export const getAllChallenges = async () => {
  const response = await api.get("challenge/user/challenges");
  return response.data.data;
};

export const getAllChallengesValidates = async () => {
    const response = await api.get("challenge/admin/validatedchallenges"); 
    return response.data.data;
};

// Créer un nouveau challenge (ADMIN uniquement)
export const createChallenge = async (challengeData: {
  title: string;
  description: string;
  category: string;
  points: number;
}) => {
  const response = await api.post("challenge/admin/challenge", challengeData);
  return response.data;
};

// Mettre à jour un challenge existant (nouvelle route à créer côté backend si besoin)
export const updateChallenge = async (challengeData: {
  id: number;
  title?: string;
  description?: string;
  category?: string;
  points?: number;
}) => {
  const response = await api.put("challenge/admin/updatechallenge", challengeData);
  return response.data;
};

// Valider un challenge (ADMIN uniquement)
export const validateChallenge = async ({
  challengeId,
  type,
  targetId
}: {
  challengeId: number;
  type: "user" | "team" | "faction";
  targetId: number;
}) => {
  const response = await api.post("challenge/admin/validate", {
    challengeId,
    type,
    targetId,
  });
  return response.data;
};

export const unvalidateChallenge = async ({
    challengeId,
    factionId,
    teamId,
    userId
  }: {
    challengeId: number;
    factionId: number
    teamId: number;
    userId: number;
  }) => {
    const response = await api.post("challenge/admin/unvalidate", {
      challengeId,
      factionId,
      teamId,
      userId
    });
    return response.data;
};

// Supprimer un challenge (ADMIN uniquement)
export const deleteChallenge = async (challengeId: number) => {
  const response = await api.delete("challenge/admin/delete", { params : {challengeId} });
  return response.data;
};

// Ajouter des points à une faction (ADMIN uniquement)
export const addPointsToFaction = async ({
  title,
  factionId,
  points,
  reason,
}: {
  title: string;
  factionId: number;
  points: number;
  reason: string;
}) => {
  const response = await api.post("challenge/admin/assignpoints", {
    title,
    factionId,
    points,
    reason,
  });
  return response.data;
};


export const getFactionsPoints = async (factionId : number) => {
    const response = await api.get("challenge/user/factionpoints", {params: {factionId}});
    return response.data.data;
};