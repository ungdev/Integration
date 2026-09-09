import { useEffect, useState } from 'react';

import type { UserOnboardingStatus, UserWithTeamInfo } from '../../../../interfaces/user.interface';
import { getAdminUserOnboardingStatus } from '../../../../services/requests/user.service';

type AdminUserProfileOnboardingStatusProps = {
    selectedUser: UserWithTeamInfo;
};

const AdminUserProfileOnboardingStatus = ({ selectedUser }: AdminUserProfileOnboardingStatusProps) => {
    const [onboardingStatus, setOnboardingStatus] = useState<UserOnboardingStatus | null>(null);

    useEffect(() => {
        const fetchOnboardingStatus = async () => {
            const status = await getAdminUserOnboardingStatus(selectedUser.userId);
            setOnboardingStatus(status);
        };

        setOnboardingStatus(null);
        fetchOnboardingStatus();
    }, [selectedUser]);

    const vssStatusMap: Record<string, { color: string; label: string }> = {
        pending: {
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            label: '⏳ En attente',
        },
        toretry: {
            color: 'bg-orange-100 text-orange-800 border-orange-200',
            label: '🔄 À réessayer',
        },
        validated: {
            color: 'bg-green-100 text-green-800 border-green-200',
            label: '✅ Validé',
        },
        rejected: {
            color: 'bg-red-100 text-red-800 border-red-200',
            label: '❌ Rejeté',
        },
    };

    const vssStatus = onboardingStatus?.vss_form
        ? vssStatusMap[onboardingStatus.vss_form]
        : {
              color: 'bg-gray-100 text-gray-700 border-gray-200',
              label: 'Inconnu',
          };

    return (
        <section className="border-t pt-7">
            <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">🎯 Onboarding</h3>

                    <p className="text-sm text-gray-500">État d'avancement de l'intégration du nouvel étudiant.</p>
                </div>
            </div>

            {onboardingStatus ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                    <div className="rounded-xl border bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            Token d'enregistrement
                        </p>

                        <span
                            className={`mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-medium ${
                                onboardingStatus.hasRegistrationToken
                                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                    : 'bg-green-100 text-green-800 border-green-200'
                            }`}>
                            {onboardingStatus.hasRegistrationToken ? '⚠️ Présent' : '✅ Absent'}
                        </span>
                    </div>

                    <div className="rounded-xl border bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Contact d'urgence</p>

                        <span
                            className={`mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-medium ${
                                onboardingStatus.hasemergencyContactInformation
                                    ? 'bg-green-100 text-green-800 border-green-200'
                                    : 'bg-red-100 text-red-800 border-red-200'
                            }`}>
                            {onboardingStatus.hasemergencyContactInformation ? '✅ Complété' : '❌ Manquant'}
                        </span>
                    </div>

                    <div className="rounded-xl border bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Formulaire VSS</p>

                        <span
                            className={`mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-medium ${vssStatus.color}`}>
                            {vssStatus.label}
                        </span>
                    </div>

                    <div className="rounded-xl border bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Affectation Equipe</p>

                        <span
                            className={`mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-medium ${
                                selectedUser.team
                                    ? 'bg-green-100 text-green-800 border-green-200'
                                    : 'bg-red-100 text-red-800 border-red-200'
                            }`}>
                            {selectedUser.team ? '✅ Affecté' : '❌ Absent'}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-500">
                    Chargement du statut d'onboarding...
                </div>
            )}
        </section>
    );
};

export default AdminUserProfileOnboardingStatus;
