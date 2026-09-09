import { useState } from 'react';
import Swal from 'sweetalert2';

import { syncnewStudent } from '../../../services/requests/user.service';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

const AdminUserImportFromSIEP = () => {
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');

    const handleSync = async () => {
        setLoading(true);

        try {
            let formattedDate = '';
            if (selectedDate) {
                const [year, month, day] = selectedDate.split('-');
                formattedDate = `${year}.${month}${day}`;
            }

            const response = await syncnewStudent(formattedDate);

            Swal.fire({
                icon: 'success',
                title: 'Synchronisation réussie',
                text: response.message,
                confirmButtonColor: '#2563eb',
            });
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Erreur lors de la tentative de connexion.',
                confirmButtonColor: '#d33',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">🔄 Import API SIEP</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <label htmlFor="date" className="block text-gray-700 font-medium">
                    Choisir une date de vérification de majorité :
                </label>
                <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <div className="flex justify-center">
                    <Button
                        onClick={handleSync}
                        disabled={loading || !selectedDate}
                        className="bg-blue-500 text-white hover:bg-blue-600 p-3 rounded-lg shadow">
                        {loading ? 'Chargement...' : "🚀 Lancer l'import"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default AdminUserImportFromSIEP;
