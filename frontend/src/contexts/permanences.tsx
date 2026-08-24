import React, { createContext, useContext, useEffect, useState } from 'react';

import type { ConcurrentPermanences } from '../interfaces/permanence.interface';
import { getConcurrentPermanencesStatus } from '../services/requests/permanence.service';
import { useUser } from './user';

type PermanencesContextType = {
    concurrentPermanences: boolean;
    concurrentPermanencesList: ConcurrentPermanences['permanences'];
    loading: boolean;
    refreshPermanences: () => Promise<void>;
};

const PermanencesContext = createContext<PermanencesContextType | undefined>(undefined);

let cachedPermanences: ConcurrentPermanences | null = null;

export const usePermanences = (): PermanencesContextType => {
    const ctx = useContext(PermanencesContext);
    if (!ctx) throw new Error('usePermanences must be used within a PermanencesProvider');
    return ctx;
};

export const PermanencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading: userLoading } = useUser();
    const [permanences, setPermanences] = useState<ConcurrentPermanences | null>(cachedPermanences);
    const [loading, setLoading] = useState<boolean>(() => cachedPermanences === null && userLoading);

    const fetchStatus = async () => {
        if (!user || user.permission !== 'Student') {
            setPermanences(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const s = await getConcurrentPermanencesStatus();
            setPermanences(s ?? null);
            cachedPermanences = s ?? null;
        } catch {
            setPermanences(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userLoading) {
            setLoading(true);
            return;
        }

        if (!user || user.permission !== 'Student') {
            cachedPermanences = null;
            setPermanences(null);
            setLoading(false);
            return;
        }

        if (!cachedPermanences) void fetchStatus();

        const handler = () => {
            void fetchStatus();
        };

        window.addEventListener('user-onboarding-updated', handler);
        return () => window.removeEventListener('user-onboarding-updated', handler);
    }, [user, userLoading]);

    const refreshPermanences = async () => {
        if (!user || user.permission !== 'Student') {
            cachedPermanences = null;
            setPermanences(null);
            return;
        }

        cachedPermanences = null;
        await fetchStatus();
    };

    return (
        <PermanencesContext.Provider
            value={{
                concurrentPermanences: permanences?.concurrentPermanences || false,
                concurrentPermanencesList: permanences?.permanences || [],
                loading,
                refreshPermanences,
            }}>
            {children}
        </PermanencesContext.Provider>
    );
};

export default PermanencesProvider;
