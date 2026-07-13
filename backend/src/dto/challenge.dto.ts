export type CreateChallengeBody = {
    title: string;
    description: string;
    category: string;
    points: number;
};

export type DeleteChallengeQuery = {
    challengeId?: string;
};

export type ValidateChallengeBody = {
    challengeId: number;
    type: 'user' | 'team' | 'faction';
    targetId: number;
};

export type UnvalidateChallengeBody = {
    challengeId: number;
    factionId?: number;
    teamId?: number;
    userId?: number;
};

export type PointsBody = {
    title: string;
    factionId: number;
    points: number;
    reason: string;
};

export type UpdateChallengeBody = {
    id: number;
    title: string;
    description: string;
    category: string;
    points: number;
};

export type FactionQuery = {
    factionId?: string;
};
