export interface Team {
    faction_id: number;
    teamId: number;
    name: string;
    description: string;
    type: string;
    socialLink: string;
}

export interface TeamDisplayInfos {
    id: number;
    name: string;
    faction_id: number;
    faction_name: string;
    social_link: string;
}
