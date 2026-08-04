import React, { createContext, useContext, useEffect, useState } from 'react';

import type { User } from '../interfaces/user.interface';
import { getToken } from '../services/requests/auth.service';
import { getCurrentUser } from '../services/requests/user.service';

type UserContextType = {
    user: User | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

let cachedUser: User | null = null;

export const useUser = (): UserContextType => {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return ctx;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const tokenPresent = Boolean(getToken());
    const [user, setUser] = useState<User | null>(cachedUser);
    const [loading, setLoading] = useState<boolean>(() => cachedUser === null && tokenPresent);

    const fetchCurrentUser = async () => {
        const token = getToken();
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const current = await getCurrentUser();
            setUser(current ?? null);
            cachedUser = current ?? null;
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!tokenPresent && !cachedUser) return;
        if (!cachedUser) {
            void fetchCurrentUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refreshUser = async () => {
        cachedUser = null;
        await fetchCurrentUser();
    };

    return <UserContext.Provider value={{ user, loading, refreshUser }}>{children}</UserContext.Provider>;
};

export default UserProvider;
