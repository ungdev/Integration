import Select from 'react-select';

import type { UserWithTeamInfo } from '../../../../interfaces/user.interface';
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card';

type AdminUserProfileSelectProps = {
    users: UserWithTeamInfo[];
    handleUserSelect: (selectedOption: { value: number; label: string } | null) => void;
};

const AdminUserProfileSelect = ({ users, handleUserSelect }: AdminUserProfileSelectProps) => {
    return (
        <Card className="w-full max-w-6xl mx-auto border-0 shadow-sm">
            <CardHeader className="border-b bg-gray-50/70">
                <div className="flex flex-col gap-1">
                    <CardTitle className="text-xl font-semibold text-gray-900">👤 Gestion des utilisateurs</CardTitle>

                    <p className="text-sm text-gray-500">
                        Recherchez un utilisateur pour consulter ou modifier son profil.
                    </p>
                </div>
            </CardHeader>

            <CardContent className="p-5">
                <Select
                    placeholder="🔎 Rechercher un utilisateur..."
                    options={users.map((u) => ({
                        value: u.userId,
                        label: `${u.firstName} ${u.lastName} — ${u.email}`,
                    }))}
                    onChange={handleUserSelect}
                    isSearchable
                    isClearable
                    className="text-sm"
                />
            </CardContent>
        </Card>
    );
};

export default AdminUserProfileSelect;
