export type ShotgunBody = {
    password?: string;
};

export type ToggleStatusBody = {
    preRegistrationOpen?: boolean;
    shotgunOpen?: boolean;
    sdiOpen?: boolean;
    weiOpen?: boolean;
    foodOpen?: boolean;
    challOpen?: boolean;
};
