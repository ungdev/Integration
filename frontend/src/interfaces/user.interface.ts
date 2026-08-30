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
    vss_form?: 'pending' | 'toretry' | 'validated' | 'rejected';
}

export interface UserWithMakerBattle extends User {
    maker_battle_table: number | null;
    maker_battle_team: number | null;
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
