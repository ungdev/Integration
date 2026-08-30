import { useState } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';

import { type MakerBattleGroupTypeOption } from '../../../interfaces/maker_battle.interface';
import { fetchExportData } from '../../../services/requests/maker_battle.service';
import { downloadJsonAsCsv } from '../../../utils/utils';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

type Props = {
    groupTypeOptions: MakerBattleGroupTypeOption[];
};

export const AdminMakerBattleTeamDownload = ({ groupTypeOptions }: Props) => {
    const [selectedGroupType, setSelectedGroupType] = useState<MakerBattleGroupTypeOption | null>(null);

    const [isDownloading, setIsDownloading] = useState<boolean>(false);

    const handleDownloadGroup = async () => {
        if (!selectedGroupType) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Veuillez sélectionner un groupe.',
            });
            return;
        }

        setIsDownloading(true);

        try {
            const exportData = await fetchExportData(selectedGroupType);

            downloadJsonAsCsv(exportData, `maker_battle_${selectedGroupType.value}_${Date.now()}.csv`);
        } catch (error) {
            console.error('Erreur lors du téléchargement des groupes:', error);

            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur est survenue lors du téléchargement des groupes.',
            });
        } finally {
            setIsDownloading(false);
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
                        isDisabled={isDownloading}
                    />
                </div>

                <div className="flex justify-end">
                    <Button
                        type="button"
                        onClick={handleDownloadGroup}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={!selectedGroupType || isDownloading}>
                        {isDownloading ? 'Téléchargement...' : 'Télécharger'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
