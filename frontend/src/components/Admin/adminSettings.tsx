import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

<<<<<<< HEAD:frontend/src/components/Admin/adminEvent.tsx
import {
    checkChallengeStatus,
    checkFoodStatus,
    checkMakerBattleGroupStatus,
    checkPreRegisterStatus,
    checkSDIStatus,
    checkShotgunStatus,
    checkWEIStatus,
    toggleChallenge,
    toggleFood,
    toggleMakerBattleGroupStatus,
    togglePreRegistration,
    toggleSDI,
    toggleShotgun,
    toggleWEI,
} from '../../services/requests/event.service';
=======
import type { Setting } from '../../interfaces/settings.interface';
import { getAdminSettings, updateSetting } from '../../services/requests/settings.service';
>>>>>>> origin/dev:frontend/src/components/Admin/adminSettings.tsx
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const AdminSettings = () => {
    const [loading, setLoading] = useState(false);
    const [loadingStatuses, setLoadingStatuses] = useState(true);

<<<<<<< HEAD:frontend/src/components/Admin/adminEvent.tsx
    const [statuses, setStatuses] = useState({
        preRegistration: false,
        shotgun: false,
        sdi: false,
        wei: false,
        food: false,
        chall: false,
        makerBattleGroup: false,
    });
=======
    const [settings, setSettings] = useState<Setting[]>([]);
>>>>>>> origin/dev:frontend/src/components/Admin/adminSettings.tsx

    // Charger les statuts au montage
    useEffect(() => {
        const fetchStatuses = async () => {
            try {
<<<<<<< HEAD:frontend/src/components/Admin/adminEvent.tsx
                const [preReg, shot, sdi, wei, food, chall, makerBattleGroup] = await Promise.all([
                    checkPreRegisterStatus(),
                    checkShotgunStatus(),
                    checkSDIStatus(),
                    checkWEIStatus(),
                    checkFoodStatus(),
                    checkChallengeStatus(),
                    checkMakerBattleGroupStatus(),
                ]);

                setStatuses({
                    preRegistration: preReg,
                    shotgun: shot.status,
                    sdi,
                    wei,
                    food,
                    chall,
                    makerBattleGroup,
                });
=======
                setSettings(await getAdminSettings());
>>>>>>> origin/dev:frontend/src/components/Admin/adminSettings.tsx
            } catch {
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Impossible de récupérer les statuts.',
                });
            } finally {
                setLoadingStatuses(false);
            }
        };
        fetchStatuses();
    }, []);

    // Fonction générique pour toggle un événement
    const handleToggle = async (setting: Setting) => {
        setLoading(true);
        try {
            const open = !setting.open;
            await updateSetting(setting.key, open);
            setSettings((previous) =>
                previous.map((current) => (current.key === setting.key ? { ...current, open } : current)),
            );
            Swal.fire({
                icon: 'success',
                title: 'Succès',
                text: `${setting.label} mis à jour !`,
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error.response?.data?.message || 'Une erreur est survenue',
            });
        } finally {
            setLoading(false);
        }
    };

<<<<<<< HEAD:frontend/src/components/Admin/adminEvent.tsx
    // Configuration des événements
    const events = [
        {
            key: 'preRegistration' as const,
            label: 'Pré-inscription',
            toggleFn: togglePreRegistration,
        },
        {
            key: 'shotgun' as const,
            label: 'Shotgun',
            toggleFn: toggleShotgun,
        },
        {
            key: 'sdi' as const,
            label: 'SDI (Billetterie)',
            toggleFn: toggleSDI,
        },
        {
            key: 'wei' as const,
            label: 'WEI (Billetterie + Tentes)',
            toggleFn: toggleWEI,
        },
        {
            key: 'food' as const,
            label: 'Nourriture (Billetterie)',
            toggleFn: toggleFood,
        },
        {
            key: 'chall' as const,
            label: 'Challenges (Affichage des challenges)',
            toggleFn: toggleChallenge,
        },
        {
            key: 'makerBattleGroup' as const,
            label: 'Groupe Défis TC/Branche',
            toggleFn: toggleMakerBattleGroupStatus,
        },
    ];

=======
>>>>>>> origin/dev:frontend/src/components/Admin/adminSettings.tsx
    if (loadingStatuses) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <Loader2 className="animate-spin text-gray-600 w-8 h-8 mr-2" />
                <span className="text-xl font-semibold text-gray-600">Chargement des statuts...</span>
            </div>
        );
    }

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    ⚙️ Gestion des settings
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {settings.map((setting) => {
                    const isActive = setting.open;
                    return (
                        <div
                            key={setting.key}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                            <div className="flex items-center gap-2 text-gray-700">
                                {isActive ? (
                                    <CheckCircle className="text-green-600 w-5 h-5" />
                                ) : (
                                    <XCircle className="text-red-600 w-5 h-5" />
                                )}
                                <span className="font-medium">{setting.label}</span>
                            </div>

                            <Button
                                onClick={() => handleToggle(setting)}
                                disabled={loading}
                                className={`transition-colors duration-300 ${
                                    isActive
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                } p-2 rounded-lg min-w-[110px] flex items-center justify-center`}>
                                {loading ? (
                                    <Loader2 className="animate-spin w-4 h-4" />
                                ) : isActive ? (
                                    'Désactiver'
                                ) : (
                                    'Activer'
                                )}
                            </Button>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
};
