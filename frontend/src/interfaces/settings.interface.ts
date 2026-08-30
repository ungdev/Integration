export interface ShotgunStatusData {
    status: boolean;
    password: string;
}

export interface Setting {
    key: string;
    label: string;
    open: boolean;
}

export interface ShotgunAttemptPayload {
    password: string;
}

export interface ApiMessageResponse {
    message: string;
}

export interface ApiErrorResponse {
    message: string;
}

export interface ShotgunAttemptRow {
    id: number;
    teamId: number | null;
    timestamp: string | null;
    teamName: string | null;
    teamType: string | null;
    leaderCount: number;
}
