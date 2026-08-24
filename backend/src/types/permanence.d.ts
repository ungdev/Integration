export type CsvPermanence = {
    name: string;
    description: string;
    location: string;
    start_at: string;
    end_at: string;
    capacity: string;
    is_open: string;
    difficulty: string;
};

export type Notification = {
    permanence: Permanence;
    members: LightUser[];
};

export type ConcurrentPermanenceNotification = {
    userId: number;
    email: string;
    permanences: Permanence[];
};

export type Permanence = {
    id: number;
    name: string;
    description: string;
    location: string;
    start_at: Date;
    end_at: Date;
    capacity: number;
    is_open: boolean;
    difficulty: number;
};

export type LightUser = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
};
