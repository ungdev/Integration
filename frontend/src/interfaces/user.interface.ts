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

export interface UserContactInformation {
    userId: number;
    urgency_contact_name: string;
    urgency_contact_phone: string;
}

export interface CreateUserContactInformationRequest {
    urgency_contact_name: string;
    urgency_contact_phone: string;
}

export interface UserOnboardingStatus {
    hasUrgencyContactInformation: boolean;
    vss_form: 'pending' | 'toretry' | 'validated' | 'rejected';
    needsVssForm: boolean;
}

export interface VssQuestionnaireAnswer {
    id: number;
    answer: string;
}

export interface VssQuestionnaireQuestion {
    id: number;
    question: string;
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
