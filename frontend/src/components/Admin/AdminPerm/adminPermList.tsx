import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronDown } from 'lucide-react';
import Swal from 'sweetalert2';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/ui/accordion';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { type Permanence } from '../../../interfaces/permanence.interface';
import { type User } from '../../../interfaces/user.interface';
import { closePermanence, deletePermanence, openPermanence } from '../../../services/requests/permanence.service';
import PermanenceMembers from './adminPermMembers';

interface PermanenceListProps {
    permanences: Permanence[];
    users: User[];
    onRefresh: () => void;
    onEdit: (perm: Permanence) => void;
}

const PermanenceList = ({ permanences, users, onRefresh, onEdit }: PermanenceListProps) => {
    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: 'Cette action est irréversible.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
        });

        if (result.isConfirmed) {
            try {
                await deletePermanence(id);
                Swal.fire('Supprimée ✅', 'La permanence a été supprimée', 'success');
                onRefresh();
            } catch {
                Swal.fire('Erreur', 'Impossible de supprimer', 'error');
            }
        }
    };

    // Tri + groupement par jour
    const sortedPermanences = [...permanences].sort(
        (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime(),
    );

    const groupedByDay = sortedPermanences.reduce((groups: Record<string, Permanence[]>, perm) => {
        const dateKey = format(new Date(perm.start_at), 'EEEE dd MMMM yyyy', { locale: fr });
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(perm);
        return groups;
    }, {});

    return (
        <Card className="w-full max-w-7xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    📋 Permanences existantes
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {Object.entries(groupedByDay).map(([day, perms]) => (
                        <AccordionItem key={day} value={day} className="border rounded-lg mb-4 shadow-sm">
                            <AccordionTrigger className="flex justify-between items-center px-4 py-3 text-lg font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-t-lg">
                                <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                                <ChevronDown className="w-5 h-5 text-gray-600 transition-transform duration-200" />
                            </AccordionTrigger>
                            <AccordionContent className="px-4 py-4 space-y-6 bg-white rounded-b-lg">
                                {perms.map((perm) => (
                                    <Card
                                        key={perm.id}
                                        className="rounded-2xl shadow-md border hover:shadow-lg transition">
                                        <CardContent className="p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Colonne gauche : infos + actions */}
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900">{perm.name}</h3>
                                                    <p className="text-sm text-gray-600 mt-1">{perm.description}</p>

                                                    <div className="text-gray-700 text-sm mt-4 space-y-1">
                                                        <div>
                                                            <strong>📍 Lieu :</strong> {perm.location}
                                                        </div>
                                                        <div>
                                                            <strong>🕒 Début :</strong>{' '}
                                                            {format(new Date(perm.start_at), 'HH:mm', { locale: fr })}
                                                        </div>
                                                        <div>
                                                            <strong>🕔 Fin :</strong>{' '}
                                                            {format(new Date(perm.end_at), 'HH:mm', { locale: fr })}
                                                        </div>
                                                        <div>
                                                            <strong>👥 Capacité :</strong> {perm.capacity}
                                                        </div>
                                                        <div>
                                                            <strong>🎚️ Difficulté :</strong> {perm.difficulty}
                                                        </div>
                                                        <div className="text-gray-700 text-sm mt-2">
                                                            <strong>👤 Responsable :</strong>{' '}
                                                            {perm.respo
                                                                ? `${perm.respo.firstName} ${perm.respo.lastName}`
                                                                : 'Aucun'}
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex flex-wrap gap-2 mt-4">
                                                        {perm.is_open ? (
                                                            <Button
                                                                onClick={() => closePermanence(perm.id).then(onRefresh)}
                                                                className="bg-orange-600 text-white">
                                                                Fermer
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                onClick={() => openPermanence(perm.id).then(onRefresh)}
                                                                className="bg-blue-600 text-white">
                                                                Ouvrir
                                                            </Button>
                                                        )}
                                                        <Button
                                                            onClick={() => onEdit(perm)}
                                                            className="bg-yellow-500 text-white">
                                                            ✏️ Éditer
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDelete(perm.id)}
                                                            className="bg-red-600 text-white">
                                                            🗑️ Supprimer
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Colonne droite : membres */}
                                                <div className="border-l pl-6">
                                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                                                        👥 Membres
                                                    </h4>
                                                    <PermanenceMembers
                                                        perm={perm}
                                                        users={users}
                                                        onRefresh={onRefresh}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
};

export default PermanenceList;
