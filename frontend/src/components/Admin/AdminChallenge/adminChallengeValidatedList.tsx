import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import Swal from 'sweetalert2';

import { type ValidatedChallenge } from '../../../interfaces/challenge.interface';
import { unvalidateChallenge } from '../../../services/requests/challenge.service';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';

interface Props {
    validatedChallenges: ValidatedChallenge[];
    fetchValidatedChallenges: () => void | Promise<void>;
}

export const AdminValidatedChallengesList = ({ validatedChallenges, fetchValidatedChallenges }: Props) => {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return validatedChallenges.filter((c) =>
            [
                c.challenge_name,
                c.challenge_categorie,
                c.challenge_description,
                c.target_user_firstname ?? '',
                c.target_user_lastname ?? '',
                c.target_team_name ?? '',
                c.target_faction_name ?? '',
            ]
                .join(' ')
                .toLowerCase()
                .includes(q),
        );
    }, [validatedChallenges, search]);

    const handleUnvalidate = async (
        challengeId: number,
        factionId: number | null,
        teamId: number | null,
        userId: number | null,
    ) => {
        const confirm = await Swal.fire({
            title: 'Confirmer la dévalidation ?',
            text: 'Cette action retirera la validation du challenge.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e3342f',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Oui, dévalider',
            cancelButtonText: 'Annuler',
        });
        if (!confirm.isConfirmed) return;

        try {
            const res = await unvalidateChallenge({
                challengeId,
                factionId: factionId ?? 0,
                teamId: teamId ?? 0,
                userId: userId ?? 0,
            });
            Swal.fire({ icon: 'success', title: 'Dévalidé', text: res.message, timer: 1800, showConfirmButton: false });
            await fetchValidatedChallenges();
        } catch {
            Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de dévalider ce challenge.' });
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                        📋 Challenges validés
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Recherche */}
                    <div className="flex items-center gap-2 border rounded-lg p-2 shadow-sm bg-gray-50">
                        <Search className="w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Rechercher (challenge, utilisateur, équipe, faction, catégorie)"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border-none focus:ring-0 bg-transparent flex-1"
                        />
                    </div>

                    {/* Grille */}
                    {filtered.length === 0 ? (
                        <p className="text-center text-gray-500">Aucun challenge validé trouvé.</p>
                    ) : (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filtered.map((c) => (
                                <div
                                    key={c.challenge_id}
                                    className="flex flex-col justify-between space-y-4 p-4 border rounded-xl bg-gray-50 hover:shadow-md transition">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900">{c.challenge_name}</h3>
                                        <p className="text-gray-600">{c.challenge_categorie}</p>
                                        <p className="text-gray-500 text-sm">{c.challenge_description}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-gray-700">
                                            <strong>Points :</strong> {c.points}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            <strong>Validé le :</strong> {new Date(c.validated_at).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-gray-800 font-semibold">Destinataire :</p>
                                        {c.target_faction_name && (
                                            <p className="text-gray-700">{c.target_faction_name}</p>
                                        )}
                                        {c.target_team_name && <p className="text-gray-700">{c.target_team_name}</p>}
                                        {(c.target_user_firstname || c.target_user_lastname) && (
                                            <p className="text-gray-700">
                                                {c.target_user_firstname} {c.target_user_lastname}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        onClick={() =>
                                            handleUnvalidate(
                                                c.challenge_id,
                                                c.target_faction_id,
                                                c.target_team_id,
                                                c.target_user_id,
                                            )
                                        }
                                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded w-full">
                                        ❌ Invalider
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
