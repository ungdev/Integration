import { useNavigate } from 'react-router-dom';

import type { UserWithTeamInfo } from '../../../../interfaces/user.interface';
import { Button } from '../../../ui/button';

type AdminUserProfileTeamProps = {
    selectedUser: UserWithTeamInfo;
};

const AdminUserProfileTeam = ({ selectedUser }: AdminUserProfileTeamProps) => {
    const navigate = useNavigate();

    const handleNavigateToTeams = () => {
        if (selectedUser.team?.id) {
            navigate(`/admin/teams?teamId=${selectedUser.team.id}`);
        }
    };

    return (
        <section className="border-t pt-7">
            <div className="mb-4">
                <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-gray-900">Equipe</h3>

                    {selectedUser.team && (
                        <Button type="button" onClick={handleNavigateToTeams}>
                            Voir l'équipe
                        </Button>
                    )}
                </div>

                <p className="text-sm text-gray-500">Informations d'affectation à l'équipe d'intégration.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Equipe</p>

                    {selectedUser.team ? (
                        <div className="mt-1 flex items-center gap-3">
                            <p className="mt-1 text-xl font-bold text-gray-900">{selectedUser.team.name}</p>
                        </div>
                    ) : (
                        <p className="mt-1 text-gray-500">-</p>
                    )}
                </div>

                <div className="rounded-xl border bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Faction</p>

                    {selectedUser.faction ? (
                        <p className="mt-1 text-xl font-bold text-gray-900">{selectedUser.faction.name}</p>
                    ) : (
                        <p className="mt-1 text-gray-500">-</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AdminUserProfileTeam;
