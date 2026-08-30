import { useState } from 'react';
import Select, { type MultiValue } from 'react-select';
import Swal from 'sweetalert2';

import type { MakerBattleGroupTypeOption } from '../../../interfaces/maker_battle.interface';
import { allocateGroups } from '../../../services/requests/maker_battle.service';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

type Props = {
    groupTypeOptions: MakerBattleGroupTypeOption[];
};

export const AdminMakerBattleTeamGeneration = ({ groupTypeOptions }: Props) => {
    const [selectedGroupTypes, setSelectedGroupTypes] = useState<MakerBattleGroupTypeOption[]>([]);

    const handleGenerateGroups = async () => {
        if (selectedGroupTypes.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Veuillez sélectionner au moins un type de groupe.',
            });
            return;
        }

        try {
            await allocateGroups(selectedGroupTypes);
            Swal.fire({
                icon: 'success',
                title: 'Répartition réussie',
                text: 'Les nouveaux ont été répartis par table avec succès.',
            });
            setSelectedGroupTypes([]); // Réinitialiser la sélection après la répartition
        } catch (error) {
            console.error('Erreur lors de la répartition des groupes:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Une erreur est survenue lors de la répartition des groupes.',
            });
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    Répartition des nouveaux
                    <br />
                    Batailles de conception
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="maker-battle-group-types" className="block text-sm font-medium text-gray-700">
                        Types de nouveaux à répartir:
                    </label>
                    <Select
                        inputId="maker-battle-group-types"
                        isMulti
                        options={groupTypeOptions}
                        value={groupTypeOptions.filter((option) => selectedGroupTypes.includes(option))}
                        onChange={(options: MultiValue<MakerBattleGroupTypeOption>) =>
                            setSelectedGroupTypes(Array.from(options))
                        }
                        placeholder="Sélectionner un ou plusieurs types"
                        closeMenuOnSelect={false}
                        isClearable
                    />
                    <p className="border-l-4 border-orange-500 bg-orange-50 px-5 py-4 text-sm italic text-orange-900">
                        <span className="font-semibold not-italic">ATTENTION :</span> Si vous ne souhaitez pas que les
                        numéros de table entrent en collision entre deux groupes, veillez à les générer ensemble.
                    </p>

                    <p className="border-l-2 border-gray-300 pl-4 text-sm leading-relaxed text-gray-600">
                        <span className="font-semibold text-gray-700">Exemple :</span> si vous souhaitez que les
                        nouveaux <i>Branche</i> et <i>RI</i> effectuent la bataille en même temps, il faut sélectionner
                        les deux groupes afin de les générer en même temps. Dans le cas contraire, une table{' '}
                        <i>Branche</i> pourrait avoir le même numéro qu'une table <i>RI</i>.
                    </p>
                </div>
                <div className="flex justify-end">
                    <Button
                        type="button"
                        onClick={handleGenerateGroups}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={!selectedGroupTypes.length}>
                        Répartir les nouveaux par table
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
