import { useEffect, useState } from 'react';

import type { UserContactInformation, UserWithMakerBattle } from '../../../../interfaces/user.interface';
import { getUserContactInformation } from '../../../../services/requests/user.service';
import { Button } from '../../../ui/button';

type AdminUserProfileEmergencyContactProps = {
    selectedUser: Partial<UserWithMakerBattle>;
};

const AdminUserProfileEmergencyContact = ({ selectedUser }: AdminUserProfileEmergencyContactProps) => {
    const [contactInformation, setContactInformation] = useState<Partial<UserContactInformation> | null>(null);

    useEffect(() => {
        const fetchOnboardingStatus = async () => {
            if (!selectedUser.userId) {
                return;
            }
            const res = await getUserContactInformation(selectedUser.userId);
            setContactInformation(res);
        };

        setContactInformation(null);
        fetchOnboardingStatus();
    }, [selectedUser]);

    return (
        <section className="border-t pt-7">
            <div className="mb-4">
                <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">📞 Contact d'urgence</h3>

                    {contactInformation?.emergency_contact_phone && (
                        <a href={`tel:${contactInformation.emergency_contact_phone}`} className="inline-flex shrink-0">
                            <Button type="button" className="bg-red-600 text-white hover:bg-red-700">
                                📞 Appeler
                            </Button>
                        </a>
                    )}
                </div>

                <p className="text-sm text-gray-500">
                    Coordonnées fournies par l'utilisateur. Ces informations sont en lecture seule.
                    <br />
                    Pour toute demande de modification, merci de contacter les développeurs.
                </p>
            </div>

            {contactInformation !== null ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                    <div className="rounded-xl border bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Nom</p>

                        {contactInformation?.emergency_contact_name ? (
                            <p className="mt-1 text-xl font-bold text-gray-900">
                                {contactInformation.emergency_contact_name}
                            </p>
                        ) : (
                            <p className="mt-1 text-gray-500">-</p>
                        )}
                    </div>

                    <div className="rounded-xl border bg-gray-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Téléphone</p>

                        {contactInformation?.emergency_contact_phone ? (
                            <p className="mt-1 text-xl font-bold text-gray-900">
                                {contactInformation.emergency_contact_phone}
                            </p>
                        ) : (
                            <p className="mt-1 text-gray-500">-</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-500">
                    Chargement du contact d'urgence...
                </div>
            )}
        </section>
    );
};

export default AdminUserProfileEmergencyContact;
