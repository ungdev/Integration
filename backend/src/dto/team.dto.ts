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
};

export type TeamRow = {
    teamId: number;
    type: string;
};

export type TeamSizeRow = {
    teamId: number;
    size: number;
};
