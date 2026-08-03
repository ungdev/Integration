export type TeamMemberRow = {
    userId: number;
};

export type StudentRow = {
    userId: number;
    email: string;
    branch: string;
    male?: boolean;
};

export type TeamAssignmentNotification = {
    email: string;
    teamId: number;
};

export type TeamRow = {
    teamId: number;
    name: string;
    description: string;
    type: string;
    socialLink: string;
    riCompatible: boolean;
};

export type TeamDistributionState = TeamRow & {
    size: number;
    girlsCount: number;
};

export type TeamSizeRow = {
    teamId: number;
    teamName: string;
    size: number;
};
