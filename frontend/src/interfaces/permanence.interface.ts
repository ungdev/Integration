import { User } from "./user.interface";

export interface Permanence {
    id: number;
    name: string;
    description: string;
    start_at: string;
    end_at: string;
    location: string;
    capacity: number;
    is_open: boolean;
    createdAt: string;
    updatedAt: string;
    difficulty: number;
    respo: User;
}
