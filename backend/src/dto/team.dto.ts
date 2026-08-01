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
