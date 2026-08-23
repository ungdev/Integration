import { useEffect, useState } from 'react';

import { useOnboarding } from '../../contexts/onboarding';
import { useUser } from '../../contexts/user';
import { decodeToken, getToken } from '../../services/requests/auth.service';
import { checkWEIStatus } from '../../services/requests/event.service';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const WeiSection = () => {
    const [isWEIOpen, setIsWEIOpen] = useState(false);
    const [hasContactInformation, setHasContactInformation] = useState(true);
    const [hasVssForm, setHasVssForm] = useState(true);
    const [needVssForm, setNeedsVssForm] = useState(false);
    const token = getToken();
    const { userPermission, userRoles = [] } = token
        ? decodeToken(token)
        : { userPermission: undefined, userRoles: [] };
    const roles = [userPermission, ...userRoles.map((r) => r.roleName)].filter(Boolean) as string[];

    const { status: onboardingStatus, loading: onboardingLoading } = useOnboarding();

    const { user, loading: userLoading } = useUser();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.billetweb.fr/js/export.js';
        script.async = true;
        document.body.appendChild(script);

        fetchStatus();
    }, [roles]);

    useEffect(() => {
        if (!roles.includes('Nouveau')) return;
        if (onboardingLoading) return;
        if (userLoading) return;
        setHasContactInformation(onboardingStatus?.hasemergencyContactInformation ?? true);
        setHasVssForm(onboardingStatus ? onboardingStatus.vss_form == 'validated' : true);
        setNeedsVssForm(onboardingStatus?.needsVssForm ?? false);
    }, [roles, onboardingLoading, onboardingStatus, userLoading]);

    const fetchStatus = async () => {
        try {
            const status = await checkWEIStatus();
            setIsWEIOpen(status);
        } catch {
            alert('Erreur lors de la récupération du statut de WEI.');
        }
    };

    return (
        <Card className="w-full max-w-6xl mx-auto bg-gradient-to-br from-blue-100 to-purple-200">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    🎉 Tu es nouveau ? Participe au WEI !
                </CardTitle>
                <p className="text-lg md:text-xl text-gray-700 text-center">
                    Un événement incroyable t'attend… Inscris-toi dès maintenant pour ne rien rater du Week-End
                    d'Intégration 2025 !
                </p>
            </CardHeader>
            {!user?.majeur && (
                <CardContent className="space-y-10">
                    <div className="surface-card p-6 text-center">
                        <p className="text-xl text-amber-500 font-semibold">
                            ⚠️ Attention, pour participer au WEI en étant mineur tu as besoin d'une autorisation
                            parentale!
                        </p>
                        <p>
                            Tu la trouvera en{' '}
                            <a
                                className="underline text-blue-500"
                                href={`${import.meta.env.VITE_API_URL}/uploads/other/parental_authorization.pdf`}>
                                cliquant ici
                            </a>
                            , une fois complétée il faudra la renvoyer à{' '}
                            <a className="underline text-blue-500" href="mailto:lucie.fritig@utt.fr">
                                lucie.fritig@utt.fr
                            </a>
                        </p>
                    </div>
                </CardContent>
            )}
            <CardContent className="space-y-10">
                {!isWEIOpen ? (
                    <div className="surface-card p-6 text-center">
                        <p className="text-xl text-red-600 font-semibold">
                            🚫 La billetterie du WEI n'est pas encore disponible.
                        </p>
                        <p className="text-gray-600 mt-2">Reste connecté, elle ouvrira bientôt !</p>
                    </div>
                ) : !hasContactInformation ? (
                    <div className="surface-card p-6 text-center">
                        <p className="text-xl text-red-600 font-semibold">
                            🚫 Tu n'as pas rempli le questionnaire avec tes contacts d'urgence. Tant que ce n'est pas
                            fait, tu ne peux pas accéder à la billetterie du Week-End d'Intégration (WEI).
                        </p>
                        <p className="text-gray-600 mt-2">Va vite le compléter !</p>
                    </div>
                ) : needVssForm ? (
                    <div className="surface-card p-6 text-center">
                        <p className="text-xl text-red-600 font-semibold">
                            🚫 Tu n'as pas rempli le questionnaire de sensibilisation aux VSS. Tant que ce n'est pas
                            fait, tu ne peux pas accéder à la billetterie du Week-End d'Intégration (WEI).
                        </p>
                        <p className="text-gray-600 mt-2">Va vite le compléter !</p>
                    </div>
                ) : !hasVssForm ? (
                    <div className="surface-card p-6 text-center">
                        <p className="text-xl text-red-600 font-semibold">
                            🚫 Tu as fait trop d'erreur sur le questionnaire de sensibilisation aux VSS. Tu ne peux par
                            conséquent pas accéder à la billeterie du Week-End d'Intégration (WEI).
                        </p>
                        <p className="text-gray-600 mt-2">
                            Si tu penses qu'il s'agit d'une erreur, tu peux te rapprocher de la team prévention.
                        </p>
                    </div>
                ) : (
                    <div className="surface-card overflow-hidden">
                        <iframe
                            title="Billetterie WEI"
                            src="https://www.billetweb.fr/week-end-dintegration-2026"
                            className="w-full h-[600px] border-none"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
