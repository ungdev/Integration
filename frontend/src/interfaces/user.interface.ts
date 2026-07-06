export interface User {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    permission: string;
    majeur: boolean;
    branch: string;
    contact: string;
    discord_id: string;
}

export interface UserContactInformation {
    userId: number;
    urgency_contact_name: string;
    urgency_contact_phone: number;
}