import { type VssSubmissionAnswer } from '../types/user';

export interface AdminCreateUserBody {
    firstName: string;
    lastName: string;
    email: string;
    major: boolean;
    branch: string;
    withNotification: boolean;
}

export type PermissionParams = {
    permission: string;
};

export type UserIdParams = {
    userId: string;
};

export type SyncBody = {
    date: string;
};

export type ProfileBody = {
    branch: string;
    contact: string;
};

export type CreateUserContactInformationBody = {
    emergency_contact_name: string;
    emergency_contact_phone: string;
};

export type VssSubmissionPayload = {
    answers: VssSubmissionAnswer[];
};
