export interface AdminCreateUserDto {
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
