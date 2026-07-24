import { useEffect, useState } from 'react';

import { decodeToken, getToken } from '../../services/requests/auth.service';
import { checkSDIStatus } from '../../services/requests/event.service';
import { getCurrentUserOnboardingStatus } from '../../services/requests/user.service';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const SdiSection = () => {
    const [isSDIOpen, setIsSDIOpen] = useState(false);
    const [hasContactInformation, setHasContactInformation] = useState(true);
    const [hasVssForm, setHasVssForm] = useState(true);
    const [needVssForm, setNeedsVssForm] = useState(false);
    const token = getToken();
    const { userPermission, userRoles = [] } = token
        ? decodeToken(token)
        : { userPermission: undefined, userRoles: [] };
    const roles = [userPermission, ...userRoles.map((r) => r.roleName)].filter(Boolean) as string[];

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.billetweb.fr/js/export.js';
        script.async = true;
        document.body.appendChild(script);

        fetchStatus();
        if (roles.includes('Nouveau')) {
            fetchOnboardingStatus();
        }
    }, [roles]);

    const fetchOnboardingStatus = async () => {
        try {
            const onboardingStatus = await getCurrentUserOnboardingStatus();
            setHasContactInformation(onboardingStatus.hasemergencyContactInformation);
            setHasVssForm(onboardingStatus.vss_form == 'validated');
            setNeedsVssForm(onboardingStatus.needsVssForm);
        } catch (error) {
            console.error("Erreur lors de la récupération du statut d'onboarding :", error);
        }
    };

    const fetchStatus = async () => {
        try {
            const status = await checkSDIStatus();
            setIsSDIOpen(status);
        } catch {
            alert('Erreur lors de la récupération du statut de SDI.');
        }
    };

    return (
        <Card className="w-full max-w-6xl mx-auto bg-gradient-to-br from-blue-100 to-purple-200">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    🎉 Participe à la Soirée d'Intégration (SDI) !
                </CardTitle>
                <p className="text-lg md:text-xl text-gray-700 text-center">
                    Un événement incroyable t'attend… Inscris-toi dès maintenant pour ne rien rater de cette Soirée
                    d'Intégration !
                </p>
            </CardHeader>
            <CardContent className="space-y-10">
                {!isSDIOpen ? (
                    <div className="surface-card p-6 text-center">
                        <p className="text-xl text-red-600 font-semibold">
                            🚫 La billetterie de la Soirée d'intégration (SDI) n'est pas encore disponible.
                        </p>
                        <p className="text-gray-600 mt-2">Reste connecté, elle ouvrira bientôt !</p>
                    </div>
                ) : !hasContactInformation ? (
                    <div className="surface-card p-6 text-center">
                        <p className="text-xl text-red-600 font-semibold">
                            🚫 Tu n'as pas rempli le questionnaire avec tes contacts d'urgence. Tant que ce n'est pas
                            fait, tu ne peux pas accéder à la billetterie de la Soirée d'intégration (SDI).
                        </p>
                        <p className="text-gray-600 mt-2">Va vite le compléter !</p>
                    </div>
                ) : needVssForm ? (
                    <div className="surface-card p-6 text-center">
                        <p className="text-xl text-red-600 font-semibold">
                            🚫 Tu n'as pas rempli le questionnaire de sensibilisation aux VSS. Tant que ce n'est pas
                            fait, tu ne peux pas accéder à la billetterie de la Soirée d'intégration (SDI).
                        </p>
                        <p className="text-gray-600 mt-2">Va vite le compléter !</p>
                    </div>
                ) : !hasVssForm ? (
                    <div className="surface-card p-6 text-center">
                        <p className="text-xl text-red-600 font-semibold">
                            🚫 Tu as fait trop d'erreur sur le questionnaire de sensibilisation aux VSS. Tu ne peux par
                            conséquent pas accéder à la billeterie de la Soirée d'intégration (SDI).
                        </p>
                        <p className="text-gray-600 mt-2">
                            Si tu penses qu'il s'agit d'une erreur, tu peux te rapprocher de la team prévention.
                        </p>
                    </div>
                ) : (
                    <div className="surface-card overflow-hidden">
                        <iframe
                            title="Billetterie SDI"
                            src="https://www.billetweb.fr/billetterie-soiree-dintegration-utt-2025"
                            className="w-full h-[600px] border-none"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
