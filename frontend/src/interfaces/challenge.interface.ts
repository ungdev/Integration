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

export interface ValidatedChallenge {
    challenge_id: number;
    challenge_name: string;
    challenge_categorie: string;
    challenge_description: string;
    points: number;
    validated_at: string; // ISO date string
    target_user_id: number | null;
    target_team_id: number | null;
    target_faction_id: number | null;
    target_user_firstname: string | null;
    target_user_lastname: string | null;
    target_team_name: string | null;
    target_faction_name: string | null;
}
