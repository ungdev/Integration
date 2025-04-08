export interface Challenge {
    id: number;
    title: string;
    description: string;
    category: string;
    points: number;
    createdBy: number; // Id de l'administrateur qui a créé le challenge
    createdAt: string; // Date de création
    updatedAt: string; // Date de mise à jour
    status: "open" | "closed" | "completed"; // Statut du challenge
}
  