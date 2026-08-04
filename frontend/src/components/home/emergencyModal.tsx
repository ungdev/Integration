import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useOnboarding } from '../../contexts/onboarding';
import { decodeToken, getToken } from '../../services/requests/auth.service';
import { createUserContactInformation } from '../../services/requests/user.service';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Modal from '../ui/modal';
import VssModal from './vssModal';

type FlowStep = 'idle' | 'loading' | 'emergency' | 'vss';

function EmergencyModal() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [form, setForm] = useState({ emergency_contact_name: '', emergency_contact_phone: '' });
    const [flowStep, setFlowStep] = useState<FlowStep>('idle');
    const [error, setError] = useState<string | null>(null);
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
            return;
        }

        if (!isNew) return;

        if (onboardingLoading) {
            setFlowStep('loading');
            return;
        }

        if (!onboardingStatus) {
            setFlowStep('emergency');
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
    };

    const handleContactSubmit = async () => {
        setError(null);

        try {
            await createUserContactInformation(form);
            window.dispatchEvent(new Event('user-onboarding-updated'));
            setFlowStep('vss');
        } catch {
            setError("Impossible d'enregistrer les informations d'urgence.");
        }
    };

    return (
        <>
            <Modal
                title="Formulaire VSS et Urgence"
                visible={isLogin && flowStep === 'emergency'}
                onCancel={closeFlow}
                buttons={null}>
                <div className="flex flex-col gap-4">
                    <p>Bienvenue sur le site de l'intégration !</p>
                    <p>Nous sommes ravis de t'accueillir parmi nous à l'UTT. </p>
                    <p>
                        Durant ta première semaine à l'UTT, tu pourras participer aux activités d'intégration. Afin que
                        celle-ci se déroule dans les meilleures conditions, nous avons besoin que tu répondes à deux
                        formulaires.
                    </p>
                    <p>
                        Dans ce premier formulaire, nous te demandons simplement de renseigner un contact d'urgence, au
                        cas où le moindre problème surviendrait durant cette semaine.
                    </p>
                    <p className="text-xs">
                        Tu peux quitter ce formulaire à tout moment et le compléter plus tard. Cependant, il est
                        obligatoire pour participer à certaines activités.
                    </p>
                    {error && (
                        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-100">
                            {error}
                        </p>
                    )}
                    <Input
                        placeholder="Nom du contact d'urgence"
                        value={form.emergency_contact_name}
                        onChange={(e) => setForm({ ...form, emergency_contact_name: e.target.value })}
                    />
                    <Input
                        placeholder="Téléphone du contact d'urgence"
                        value={form.emergency_contact_phone}
                        onChange={(e) => setForm({ ...form, emergency_contact_phone: e.target.value })}
                    />
                    <div className="flex flex-wrap items-center justify-end gap-3">
                        <Button variant="secondary" onClick={closeFlow}>
                            Annuler
                        </Button>
                        <Button onClick={handleContactSubmit}>Soumettre</Button>
                    </div>
                </div>
            </Modal>

            <VssModal
                visible={isLogin && flowStep === 'vss'}
                onCancel={closeFlow}
                onSubmitted={() => {
                    window.dispatchEvent(new Event('user-onboarding-updated'));
                }}
            />
        </>
    );
}

export default EmergencyModal;
