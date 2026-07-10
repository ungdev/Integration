import { useState } from 'react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

import type { AdminBannedProps, Banned } from '../../interfaces/banned.interface';
import { addBanned, getAllBanned, removeBanned } from '../../services/requests/banned.service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';

export const AdminBannedList = ({ ...props }: AdminBannedProps) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchShotgunAttempts = async () => {
            try {
                const data = await getAllBanned();
                props.setBannedList(data);
            } catch {
                setError('Impossible de récupérer les addresses bannies.');
            } finally {
                setLoading(false);
            }
        };

        void fetchShotgunAttempts();
    }, []);

    const handleDelete = async (banned: Banned) => {
        const confirm = await Swal.fire({
            title: `Supprimer l'adresse ${banned.email} ?`,
            text: 'Il sera à nouveau possible de créer un compte avec cette adresse email.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui',
            cancelButtonText: 'Annuler',
        });

        if (!confirm.isConfirmed) return;

        try {
            const response = await removeBanned(banned.id);

            props.setBannedList(props.bannedList.filter((item) => item.id !== response.data.id));

            Swal.fire({
                icon: 'success',
                title: 'Adresse retirée',
                text: response.message,
                confirmButtonColor: '#16a34a',
            });
        } catch (error: any) {
            Swal.fire({
                title: 'Erreur ❌',
                text: error?.response?.data?.msg || 'Une erreur est survenue.',
                icon: 'error',
            });
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    Adresses emails bannies
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {loading && <p className="text-center text-gray-600">Chargement...</p>}
                {!loading && error && <p className="text-center text-red-600">{error}</p>}

                {!loading && !error && (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left">Addresse</th>
                                    <th className="px-4 py-3 text-right">Supprimer</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.bannedList
                                    .sort((a, b) => a.email.localeCompare(b.email))
                                    .map((banned) => (
                                        <tr key={banned.id} className="border-t border-gray-200">
                                            <td className="px-4 py-3 font-semibold">{banned.email}</td>
                                            <td className="px-4 py-3 font-semibold text-right">
                                                <Button onClick={() => handleDelete(banned)}>Retirer</Button>
                                            </td>
                                        </tr>
                                    ))}
                                {props.bannedList.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                            Aucune addresse enregistrée.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export const AdminBannedAddEmail = ({ ...props }: AdminBannedProps) => {
    const [newAddress, setNewAddress] = useState<string>('');

    const handleSave = async () => {
        if (props.bannedList.map((banned) => banned.email).includes(newAddress)) {
            Swal.fire({
                title: 'Addresse déjà présente',
                icon: 'error',
            });
            return;
        }

        const confirm = await Swal.fire({
            title: `Supprimer le compte de ${newAddress} ?`,
            text: "Le compte de l'utilisateur sera supprimé (s'il existe), et il ne pourra plus se créer de compte.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui',
            cancelButtonText: 'Annuler',
        });

        if (confirm.isConfirmed) {
            try {
                const response = await addBanned(newAddress);

                props.setBannedList([response.data, ...props.bannedList]);

                setNewAddress('');

                Swal.fire({
                    icon: 'success',
                    title: 'Adresse bannie',
                    text: response.message,
                    confirmButtonColor: '#16a34a',
                });
            } catch (error: any) {
                Swal.fire({
                    title: 'Erreur ❌',
                    text: error?.response?.data?.msg || 'Une erreur est survenue.',
                    icon: 'error',
                });
            }
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    ➕ Nouvelle adresse bannie
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <form
                    className="space-y-3 mt-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}>
                    <Input
                        name="email"
                        type="email"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        placeholder="Email"
                    />

                    <div className="flex gap-4 mt-4">
                        <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                            💾 Ajouter
                        </Button>
                    </div>
                    <div className="text-gray-500">
                        Explication:
                        <p>
                            Les adresses emails ajoutées à la liste de ban ne seront plus synchronisées, la création de
                            leur compte étant impossible, même lors d'un envoi depuis l'API de l'UTT. Il s'agit de la
                            technique idéale pour les personnes démissionnaires ou interdites d'intégration.
                            <br />
                            L'ajout d'une adresse à cette liste supprimera immédiatement le compte affilié à cette
                            adresse email s'il existe.
                        </p>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
