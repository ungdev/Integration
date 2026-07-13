export type PermanenceBody = {
    name?: string;
    description?: string;
    location?: string;
    start_at?: string;
    end_at?: string;
    capacity?: number | string;
    difficulty?: number | string;
    respoId?: number | string;
    permId?: number | string;
    userId?: number | string;
    claimed?: boolean;
};

export type PermQuery = { permId?: string; userId?: string };
