export const permissionOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Student', label: 'Étudiant' },
    { value: 'Nouveau', label: 'Nouveau' },
];

export const branchOptions = [
    { value: 'TC', label: 'Tronc Commun' },
    { value: 'RT', label: 'Réseaux et Télécommunications' },
    { value: 'ISI', label: "Informatique et Systèmes d'Information" },
    { value: 'GM', label: 'Génie Mécanique' },
    { value: 'GI', label: 'Génie Industriel' },
    { value: 'MTE', label: 'Matériaux : Technologie et Économie' },
    { value: 'A2I', label: 'Automatique & Informatique Industrielle' },
    { value: 'GI_APPR', label: 'Génie Industriel en Apprentissage' },
    { value: 'GM_APPR', label: 'Génie Mécanique en Apprentissage' },
    { value: 'SN_APPR', label: 'Système Numérique en Apprentissage' },
    { value: 'Branch', label: 'Branche' },
    { value: 'IA_BACH', label: 'Intelligence Artificielle en bachelor' },
    { value: 'MM', label: 'Mécanique et Matériaux' },
    { value: 'MA', label: 'Master' },
    { value: 'RI', label: 'Ressources Internationales' },
];

export const majorOptions = [
    { value: true, label: 'Majeur' },
    { value: false, label: 'Mineur' },
];

export const genderOptions = [
    { value: true, label: 'Homme' },
    { value: false, label: 'Femme' },
];

export type BranchOption = (typeof branchOptions)[number];

export type MajorOption = (typeof majorOptions)[number];

export type GenderOption = (typeof genderOptions)[number];

export interface User {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    permission: string;
    majeur: boolean;
    branch: string;
    contact: string;
    discord_id: string;
    male?: boolean | null;
    vss_form?: 'pending' | 'toretry' | 'validated' | 'rejected';
}

export interface UserWithMakerBattle extends User {
    maker_battle_table: number | null;
    maker_battle_team: number | null;
}

export interface Team {
    id: number;
    name: string;
}

export interface Faction {
    id: number;
    name: string;
}

export interface UserWithTeamInfo extends UserWithMakerBattle {
    team: Team | null;
    faction: Faction | null;
}

export interface UserContactInformation {
    userId: number;
    emergency_contact_name: string;
    emergency_contact_phone: string;
}

export interface CreateUserContactInformationRequest {
    emergency_contact_name: string;
    emergency_contact_phone: string;
}

export interface UserOnboardingStatus {
    hasemergencyContactInformation: boolean;
    vss_form: 'pending' | 'toretry' | 'validated' | 'rejected';
    needsVssForm: boolean;
    hasRegistrationToken?: boolean;
}

export interface VssQuestionnaireAnswer {
    id: number;
    answer: string;
    answerEn?: string;
}

export interface VssQuestionnaireQuestion {
    id: number;
    question: string;
    questionEn?: string;
    points: number;
    type: 'single_choice' | 'multiple_choice';
    answers: VssQuestionnaireAnswer[];
}

export interface VssSubmissionAnswer {
    questionId: number;
    answerIds: number[];
}

export interface VssSubmissionRequest {
    answers: VssSubmissionAnswer[];
}

export interface VssSubmissionResponse {
    score: number;
    maxScore: number;
    status: 'pending' | 'toretry' | 'validated' | 'rejected';
}

export interface NewUser {
    firstName: string;
    lastName: string;
    email: string;
    major: boolean;
    branch: string;
    withNotification: boolean;
}
