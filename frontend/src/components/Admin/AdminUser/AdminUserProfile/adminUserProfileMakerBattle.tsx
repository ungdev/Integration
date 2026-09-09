import type { UserWithMakerBattle } from '../../../../interfaces/user.interface';

type AdminUserProfileMakerBattleProps = {
    selectedUser: Partial<UserWithMakerBattle>;
};

const AdminUserProfileMakerBattle = ({ selectedUser }: AdminUserProfileMakerBattleProps) => {
    return (
        <section className="border-t pt-7">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">🎮 Défi TC</h3>

                <p className="text-sm text-gray-500">Informations d'affectation au Maker Battle.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Table</p>

                    {selectedUser.maker_battle_table ? (
                        <p className="mt-1 text-xl font-bold text-gray-900">{selectedUser.maker_battle_table}</p>
                    ) : (
                        <p className="mt-1 text-gray-500">-</p>
                    )}
                </div>

                <div className="rounded-xl border bg-gray-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Téléphone</p>

                    {selectedUser.maker_battle_team ? (
                        <p className="mt-1 text-xl font-bold text-gray-900">{selectedUser.maker_battle_team}</p>
                    ) : (
                        <p className="mt-1 text-gray-500">-</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AdminUserProfileMakerBattle;
