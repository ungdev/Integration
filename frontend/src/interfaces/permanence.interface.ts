import { type User } from './user.interface';

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

export interface PermanenceActionsProps {
    permanences: Permanence[];
    onRefresh: () => void;
}

export interface ConcurrentPermanences {
    concurrentPermanences: boolean;
    permanences: Pick<Permanence, 'id' | 'name' | 'description' | 'location' | 'start_at' | 'end_at'>[];
}
