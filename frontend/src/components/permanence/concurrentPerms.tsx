import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import type { ConcurrentPermanences } from '../../interfaces/permanence.interface';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ConcurrentPermanencesProps {
    permanences: ConcurrentPermanences['permanences'];
}

export const ConcurrentPermanencesCard: React.FC<ConcurrentPermanencesProps> = ({ permanences }) => {
    return (
        <Card className="border-l-4 border-amber-500">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-amber-700">Permanences concurrentes</CardTitle>
                <p className="text-gray-700">Ces permanences se déroulent sur des créneaux qui se chevauchent.</p>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {permanences.map((permanence) => (
                        <Card key={permanence.id} className="border border-amber-200 gap-2 py-4">
                            <CardHeader className="px-4">
                                <CardTitle className="text-lg text-gray-800">{permanence.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 text-gray-600">
                                <p>📍 {permanence.location}</p>
                                <p>
                                    🕒 {format(new Date(permanence.start_at), "EEEE dd MMMM 'à' HH:mm", { locale: fr })}{' '}
                                    - {format(new Date(permanence.end_at), 'HH:mm', { locale: fr })}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <p className="mt-4 text-gray-700">
                    Après un shotgun, vous avez <strong className="text-red-500">jusqu'au lendemain midi</strong> pour
                    supprimer les doublons, sinon des permanences seront{' '}
                    <strong className="text-red-500">retirées de manière aléatoire</strong> pour éliminer les conflits,
                    et les permanences libérées seront à nouveau shotgun le lendemain.
                </p>
            </CardContent>
        </Card>
    );
};
