import type { Dispatch, SetStateAction } from 'react';

export interface Banned {
    id: number;
    email: string;
}

export interface AdminBannedProps {
    bannedList: Banned[];
    setBannedList: Dispatch<SetStateAction<Banned[]>>;
}
