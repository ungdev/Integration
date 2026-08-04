import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useOnboarding } from '../../contexts/onboarding';
import { decodeToken, getToken } from '../../services/requests/auth.service';
import { createUserContactInformation } from '../../services/requests/user.service';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Modal from '../ui/modal';
import VssModal, { type Language } from './vssModal';

type FlowStep = 'idle' | 'loading' | 'emergency' | 'vss';

const copy = {
    fr: {
        title: 'Formulaire VSS et Urgence',
        toggleLanguage: 'Show in English',
        intro: [
            "Bienvenue sur le site de l'intégration !",
            "Nous sommes ravis de t'accueillir parmi nous à l'UTT.",
            "Durant ta première semaine à l'UTT, tu pourras participer aux activités d'intégration. Afin que celle-ci se déroule dans les meilleures conditions, nous avons besoin que tu répondes à deux formulaires.",
            "Dans ce premier formulaire, nous te demandons simplement de renseigner un contact d'urgence, au cas où le moindre problème surviendrait durant cette semaine.",
            'Tu peux quitter ce formulaire à tout moment et le compléter plus tard. Cependant, il est obligatoire pour participer à certaines activités.',
        ],
        placeholders: {
            name: "Nom du contact d'urgence",
            phone: "Téléphone du contact d'urgence",
        },
        buttons: {
            cancel: 'Annuler',
            submit: 'Soumettre',
        },
        statusError: 'Impossible de récupérer le statut du formulaire.',
        submitError: "Impossible d'enregistrer les informations d'urgence.",
    },
    en: {
        title: 'VSS and Emergency Form',
        toggleLanguage: 'Voir en français',
        intro: [
            'Welcome to the integration website!',
            'We are happy to have you with us at UTT.',
            'During your first week at UTT, you will be able to take part in the integration activities. To make sure everything goes as smoothly as possible, we need you to answer two forms.',
            'In this first form, we simply ask you to provide an emergency contact in case the slightest issue happens during this week.',
            'You can leave this form at any time and complete it later. However, it is mandatory to participate in certain activities.',
        ],
        placeholders: {
            name: 'Emergency contact name',
            phone: 'Emergency contact phone number',
        },
        buttons: {
            cancel: 'Cancel',
            submit: 'Submit',
        },
        statusError: 'Unable to fetch the form status.',
        submitError: 'Unable to save the emergency contact information.',
    },
} as const;

function EmergencyModal() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [form, setForm] = useState({ emergency_contact_name: '', emergency_contact_phone: '' });
    const [flowStep, setFlowStep] = useState<FlowStep>('idle');
    const [error, setError] = useState<string | null>(null);
    const [language, setLanguage] = useState<Language>('fr');
    const token = getToken();
    const decodedToken = useMemo(() => (token ? decodeToken(token) : null), [token]);
    const userPermission = decodedToken?.userPermission;
    const roles = useMemo(() => {
        const userRoles = decodedToken?.userRoles ?? [];
        return [userPermission, ...userRoles.map((r) => r.roleName)].filter(Boolean) as string[];
    }, [userPermission, decodedToken?.userRoles]);

    const isLogin = searchParams.get('login') === 'true';
    const isNew = roles.includes('Nouveau');

    const { status: onboardingStatus, loading: onboardingLoading } = useOnboarding();

    useEffect(() => {
        if (!isLogin) {
            setFlowStep('idle');
            setForm({ emergency_contact_name: '', emergency_contact_phone: '' });
            setError(null);
            setLanguage('fr');
            return;
        }
        if (!isNew) return;
        if (onboardingLoading) {
            setFlowStep('loading');
            return;
        }
        if (!onboardingStatus) {
            setFlowStep('emergency');
            setError(copy[language].statusError);
            return;
        }
        if (!onboardingStatus.hasemergencyContactInformation) {
            setFlowStep('emergency');
            return;
        }
        if (onboardingStatus.needsVssForm) {
            setFlowStep('vss');
            return;
        }
        setFlowStep('idle');
        setSearchParams({});
    }, [isLogin, isNew, onboardingLoading, onboardingStatus, setSearchParams]);

    const closeFlow = () => {
        setSearchParams({});
        setFlowStep('idle');
        setForm({ emergency_contact_name: '', emergency_contact_phone: '' });
        setError(null);
        setLanguage('fr');
    };

    const handleContactSubmit = async () => {
        setError(null);

        try {
            await createUserContactInformation(form);
            window.dispatchEvent(new Event('user-onboarding-updated'));
            setFlowStep('vss');
        } catch {
            setError(copy[language].submitError);
        }
    };

    const localizedCopy = copy[language];

    return (
        <>
            <Modal
                title={localizedCopy.title}
                visible={isLogin && flowStep === 'emergency'}
                onCancel={closeFlow}
                buttons={null}>
                <div className="flex flex-col gap-4">
                    <div className="flex justify-end">
                        <Button
                            variant="secondary"
                            onClick={() => setLanguage((currentLanguage) => (currentLanguage === 'fr' ? 'en' : 'fr'))}>
                            {localizedCopy.toggleLanguage}
                        </Button>
                    </div>

                    {localizedCopy.intro.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                    {error && (
                        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-100">
                            {error}
                        </p>
                    )}
                    <Input
                        placeholder={localizedCopy.placeholders.name}
                        value={form.emergency_contact_name}
                        onChange={(e) => setForm({ ...form, emergency_contact_name: e.target.value })}
                    />
                    <Input
                        placeholder={localizedCopy.placeholders.phone}
                        value={form.emergency_contact_phone}
                        onChange={(e) => setForm({ ...form, emergency_contact_phone: e.target.value })}
                    />
                    <div className="flex flex-wrap items-center justify-end gap-3">
                        <Button variant="secondary" onClick={closeFlow}>
                            {localizedCopy.buttons.cancel}
                        </Button>
                        <Button onClick={handleContactSubmit}>{localizedCopy.buttons.submit}</Button>
                    </div>
                </div>
            </Modal>

            <VssModal
                visible={isLogin && flowStep === 'vss'}
                onCancel={closeFlow}
                language={language}
                onToggleLanguage={() => setLanguage((currentLanguage) => (currentLanguage === 'fr' ? 'en' : 'fr'))}
                onSubmitted={() => {
                    window.dispatchEvent(new Event('user-onboarding-updated'));
                }}
            />
        </>
    );
}

export default EmergencyModal;
