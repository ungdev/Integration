import React, { createContext, useContext, useEffect, useState } from 'react';

import type { UserOnboardingStatus } from '../interfaces/user.interface';
import { getToken } from '../services/requests/auth.service';
import { getCurrentUserOnboardingStatus } from '../services/requests/user.service';

type OnboardingContextType = {
    status: UserOnboardingStatus | null;
    loading: boolean;
    refreshOnboarding: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

let cachedOnboarding: UserOnboardingStatus | null = null;

export const useOnboarding = (): OnboardingContextType => {
    const ctx = useContext(OnboardingContext);
    if (!ctx) throw new Error('useOnboarding must be used within an OnboardingProvider');
    return ctx;
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const tokenPresent = Boolean(getToken());
    const [status, setStatus] = useState<UserOnboardingStatus | null>(cachedOnboarding);
    const [loading, setLoading] = useState<boolean>(() => cachedOnboarding === null && tokenPresent);

    const fetchStatus = async () => {
        const token = getToken();
        if (!token) {
            setStatus(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const s = await getCurrentUserOnboardingStatus();
            setStatus(s ?? null);
            cachedOnboarding = s ?? null;
        } catch {
            setStatus(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!tokenPresent && !cachedOnboarding) {
            // nothing to do when not authenticated
            return;
        }

        if (!cachedOnboarding) void fetchStatus();

        const handler = () => {
            void fetchStatus();
        };

        window.addEventListener('user-onboarding-updated', handler);
        return () => window.removeEventListener('user-onboarding-updated', handler);
    }, []);

    const refreshOnboarding = async () => {
        cachedOnboarding = null;
        await fetchStatus();
    };

    return (
        <OnboardingContext.Provider value={{ status, loading, refreshOnboarding }}>
            {children}
        </OnboardingContext.Provider>
    );
};

export default OnboardingProvider;
