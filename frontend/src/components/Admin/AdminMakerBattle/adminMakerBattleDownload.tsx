import { useState } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';

import type { MakerBattleGroupTypeOption } from '../../../interfaces/maker_battle.interface';
import { exportGroups } from '../../../services/requests/maker_battle.service';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

type Props = {
    groupTypeOptions: MakerBattleGroupTypeOption[];
};

export const AdminMakerBattleTeamDownload = ({ groupTypeOptions }: Props) => {
    const [selectedGroupType, setSelectedGroupType] = useState<MakerBattleGroupTypeOption | null>(null);

    const handleDownloadGroup = async () => {
        if (!selectedGroupType) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Veuillez sélectionner un groupe.',
            });
            return;
        }

        const newTab = window.open('', '_blank');

        try {
            const { filename } = await exportGroups(selectedGroupType);

            const url = `${import.meta.env.VITE_API_URL}/exports/makerbattlegroups${filename}`;

            if (newTab) {
                newTab.location.href = url;
            }
        } catch (error) {
            newTab?.close();
            console.error('Erreur lors du téléchargement des groupes:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur est survenue lors du téléchargement des groupes.',
            });
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">Téléchargement</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="maker-battle-group-types" className="block text-sm font-medium text-gray-700">
                        Groupes à télécharger
                    </label>

                    <Select<MakerBattleGroupTypeOption>
                        inputId="maker-battle-group-types"
                        options={groupTypeOptions}
                        value={selectedGroupType}
                        onChange={setSelectedGroupType}
                        placeholder="Sélectionner un type"
                        isClearable
                    />
                </div>
                <div className="flex justify-end">
                    <Button
                        type="button"
                        onClick={handleDownloadGroup}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={!selectedGroupType}>
                        Télécharger
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
