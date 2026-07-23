export type CreateTeamBody = {
    teamName?: string;
    members: number[];
};

export type CreateTeamLightBody = {
    teamName?: string;
    factionId?: number;
};

export type ModifyTeamBody = {
    teamID?: number;
    teamName?: string;
    teamMembers: number[];
    factionID?: number;
    socialLink?: string;
    type?: string;
};

export type TeamQuery = {
    teamId?: string;
    teamID?: string;
};

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
