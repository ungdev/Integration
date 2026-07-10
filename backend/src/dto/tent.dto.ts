export type CreateTentBody = {
    userId2: number;
};

export type ToggleTentBody = {
    userId1: number;
    userId2: number;
    confirmed: boolean;
};
