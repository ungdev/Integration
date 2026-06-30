import { useEffect, useMemo, useState } from 'react';
import Select, { type SingleValue } from 'react-select';
import Swal from 'sweetalert2';

import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { type Permanence } from '../../../interfaces/permanence.interface';
import { type User } from '../../../interfaces/user.interface';
import {
    addUserToPermanence,
    claimedMemberAdmin,
    getUsersByPermanence,
    removeUserFromPermanence,
} from '../../../services/requests/permanence.service';

interface PermanenceMembersProps {
    perm: Permanence;
    users: User[];
    onRefresh: () => void;
}

interface PermanenceMember extends User {
    claimed: boolean;
}

interface Option {
    value: User;
    label: string;
}

const PermanenceMembers: React.FC<PermanenceMembersProps> = ({ perm, users, onRefresh }) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [members, setMembers] = useState<PermanenceMember[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const options: Option[] = useMemo(() => {
        const memberIds = new Set(members.map((m) => m.userId));
        return users
            .filter((u) => !memberIds.has(u.userId))
            .map((u) => ({
                value: u,
                label:
                    u.firstName || u.lastName
                        ? `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim()
                        : `Utilisateur ${u.userId}`,
            }));
    }, [users, members]);

    const fetchMembers = async (): Promise<void> => {
        try {
            setLoading(true);
            const res = await getUsersByPermanence(perm.id);
            setMembers((res.data as PermanenceMember[]) ?? []);
        } catch {
            Swal.fire('Erreur', 'Impossible de récupérer les membres', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (expanded) {
            void fetchMembers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expanded, perm.id]);

    const handleAdd = async (): Promise<void> => {
        if (!selectedUser) return;
        try {
            await addUserToPermanence(perm.id, selectedUser.userId);
            await Swal.fire('Ajouté', 'Membre ajouté à la permanence', 'success');
            setSelectedUser(null);
            await fetchMembers();
            onRefresh();
        } catch {
            Swal.fire('Erreur', "Impossible d'ajouter ce membre", 'error');
        }
    };

    const handleRemove = async (userId: number): Promise<void> => {
        const result = await Swal.fire({
            title: 'Retirer ce membre ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Retirer',
            cancelButtonText: 'Annuler',
        });

        if (!result.isConfirmed) return;

        try {
            await removeUserFromPermanence(perm.id, userId);
            await Swal.fire('Retiré', 'Membre retiré de la permanence', 'success');
            await fetchMembers();
            onRefresh();
        } catch {
            Swal.fire('Erreur', 'Suppression impossible', 'error');
        }
    };

    const handleToggleClaim = async (user: PermanenceMember): Promise<void> => {
        try {
            const newClaimedStatus = !user.claimed;
            await claimedMemberAdmin(user.userId, perm.id, newClaimedStatus);

            await Swal.fire(
                newClaimedStatus ? 'Présence confirmée' : 'Présence retirée',
                `Le membre est marqué comme ${newClaimedStatus ? 'présent' : 'absent'}`,
                newClaimedStatus ? 'success' : 'info',
            );

            await fetchMembers();
            onRefresh();
        } catch {
            Swal.fire('Erreur', 'Impossible de modifier la présence', 'error');
        }
    };

    return (
        <Card className="mt-6 bg-gray-50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-md font-semibold">Membres</CardTitle>
                    <Button variant="secondary" onClick={() => setExpanded((e) => !e)}>
                        {expanded ? 'Masquer' : '👥 Voir membres'}
                    </Button>
                </div>
            </CardHeader>

            {expanded && (
                <CardContent>
                    {loading ? (
                        <p className="text-sm text-gray-500">Chargement…</p>
                    ) : members.length === 0 ? (
                        <p className="text-sm text-gray-500">Aucun membre pour l'instant.</p>
                    ) : (
                        <ul className="text-sm space-y-2">
                            {members.map((user) => (
                                <li key={user.userId} className="flex justify-between items-center">
                                    <span>
                                        {user.firstName || user.lastName
                                            ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
                                            : `Utilisateur ${user.userId}`}
                                    </span>
                                    <div className="flex gap-2 items-center">
                                        <Button
                                            onClick={() => void handleToggleClaim(user)}
                                            className={`text-xs px-2 py-1 ${
                                                user.claimed
                                                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                                            }`}>
                                            {user.claimed ? '❌ Marquer absent' : '✅ Marquer présent'}
                                        </Button>
                                        <Button
                                            onClick={() => void handleRemove(user.userId)}
                                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1">
                                            Retirer
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="flex flex-col md:flex-row gap-2 mt-4 items-center">
                        <div className="flex-1 w-full">
                            <Select<Option, false>
                                options={options}
                                value={
                                    selectedUser
                                        ? {
                                              value: selectedUser,
                                              label:
                                                  options.find((o) => o.value.userId === selectedUser.userId)?.label ??
                                                  '',
                                          }
                                        : null
                                }
                                onChange={(opt: SingleValue<Option>) => setSelectedUser(opt?.value ?? null)}
                                placeholder="Sélectionner un utilisateur à ajouter"
                                isClearable
                            />
                        </div>

                        <Button onClick={() => void handleAdd()} className="bg-green-600 hover:bg-green-700 text-white">
                            Ajouter
                        </Button>
                    </div>

                    <p className="text-xs text-red-500 underline mt-4">
                        <strong>Attention&nbsp;: en tant qu'Admin vous pouvez bypass les quotas</strong>
                    </p>
                </CardContent>
            )}
        </Card>
    );
};

export default PermanenceMembers;
