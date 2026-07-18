export type LoginBody = {
    email: string;
    password: string;
};

export type RegisterBody = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

export type CasTicketQuery = {
    ticket?: string;
};

export type RegistrationBody = {
    token: string;
    password: string;
};

export type PasswordResetBody = {
    user_email: string;
};

export type RenewTokenBody = {
    userId: number;
};
