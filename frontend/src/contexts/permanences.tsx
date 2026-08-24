import React, { createContext, useContext, useEffect, useState } from 'react';

import type { ConcurrentPermanences } from '../interfaces/permanence.interface';
import { getToken } from '../services/requests/auth.service';
import { getConcurrentPermanencesStatus } from '../services/requests/permanence.service';

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
    const tokenPresent = Boolean(getToken());
    const [permanences, setPermanences] = useState<ConcurrentPermanences | null>(cachedPermanences);
    const [loading, setLoading] = useState<boolean>(() => cachedPermanences === null && tokenPresent);

    const fetchStatus = async () => {
        const token = getToken();
        if (!token) {
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
        if (!tokenPresent && !cachedPermanences) {
            // nothing to do when not authenticated
            return;
        }

        if (!cachedPermanences) void fetchStatus();

        const handler = () => {
            void fetchStatus();
        };

        window.addEventListener('user-onboarding-updated', handler);
        return () => window.removeEventListener('user-onboarding-updated', handler);
    }, []);

    const refreshPermanences = async () => {
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
