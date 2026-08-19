import { useState } from 'react';

import { exportBus, exportDb, exportTeamMembers } from '../../services/requests/im_export.service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AdminFileImport } from './adminFileImport';

export const AdminExportConnect = () => {
    const [loading, setLoading] = useState<{ db: boolean; bus: boolean; teamMembers: boolean }>({
        db: false,
        bus: false,
        teamMembers: false,
    });
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string>('');
    const [showBusExport, setShowBusExport] = useState(false);
    const [showTeamMembersExport, setShowTeamMembersExport] = useState(false);

    const busUrl = `${import.meta.env.VITE_API_URL}/exports/bus/bus.csv`;

    const teamMembersUrl = `${import.meta.env.VITE_API_URL}/exports/teammembers/teammembers.csv`;

    const handleExport = async (type: 'db' | 'bus' | 'teamMembers', exportFn: () => Promise<{ message: string }>) => {
        setLoading((prev) => ({ ...prev, [type]: true }));
        setError(null);
        setMessage('');
        try {
            const response = await exportFn();
            setMessage(response.message);
            if (type === 'bus') setShowBusExport(true);
            if (type === 'teamMembers') setShowTeamMembersExport(true);
        } catch (err) {
            console.error(`Erreur export ${type}`, err);
            setError(
                type === 'db' ? "Erreur lors de l'export vers Google Sheets." : "Erreur lors de l'export des bus.",
            );
        } finally {
            setLoading((prev) => ({ ...prev, [type]: false }));
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    ⚡ Exporter les données
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        onClick={() => handleExport('db', exportDb)}
                        disabled={loading.db}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-6 rounded-xl shadow-md transition-all duration-200">
                        {loading.db ? '⏳ Export en cours...' : 'Exporter vers Google Sheets'}
                    </Button>

                    <Button
                        onClick={() => handleExport('bus', exportBus)}
                        disabled={loading.bus}
                        className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 px-6 rounded-xl shadow-md transition-all duration-200">
                        {loading.bus ? '⏳ Export en cours...' : 'Exporter les bus'}
                    </Button>
                    <Button
                        onClick={() => handleExport('teamMembers', exportTeamMembers)}
                        className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 px-6 rounded-xl shadow-md transition-all duration-200">
                        {loading.teamMembers ? '⏳ Export en cours...' : 'Exporter les équipes'}
                    </Button>
                </div>

                {error && <p className="text-center text-sm text-red-500 font-medium animate-fade-in">{error}</p>}
                {message && !error && (
                    <p className="text-center text-sm text-green-600 font-medium animate-fade-in">✅ {message}</p>
                )}

                {showBusExport && (
                    <Card className="animate-fade-in">
                        <CardContent className="p-6 space-y-4 text-center">
                            <h3 className="text-xl font-semibold text-gray-800">📄 Télécharger le csv des bus</h3>
                            <a
                                href={busUrl}
                                download
                                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition">
                                ⬇️ Télécharger le csv
                            </a>
                        </CardContent>
                    </Card>
                )}

                {showTeamMembersExport && (
                    <Card className="animate-fade-in">
                        <CardContent className="p-6 space-y-4 text-center">
                            <h3 className="text-xl font-semibold text-gray-800">📄 Télécharger le csv des équipes</h3>
                            <a
                                href={teamMembersUrl}
                                download
                                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition">
                                ⬇️ Télécharger le csv
                            </a>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    );
};

export const AdminImportFoodMenu = () => {
    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">Importer le menu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <AdminFileImport category="foodmenu" item="menu" title="Menus des repas" />
                <AdminFileImport category="foodmenu" item="allergens" title="Allergènes" />
            </CardContent>
        </Card>
    );
};

export const AdminImportPlannings = () => {
    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    Importer les plannings
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <AdminFileImport category="plannings" item="tc" title="Tronc Commun" />
                <AdminFileImport category="plannings" item="tci" title="Tronc Commun International" />
                <AdminFileImport category="plannings" item="bachelor_ia" title="Bachelor IA" />
                <AdminFileImport category="plannings" item="fise" title="Branche FISE" />
                <AdminFileImport category="plannings" item="fisea" title="Branche FISEA" />
                <AdminFileImport category="plannings" item="ri" title="Relation Internationnales" />
                <AdminFileImport category="plannings" item="master" title="Master" />
            </CardContent>
        </Card>
    );
};

export const AdminImportNotebooks = () => {
    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    Importer les cahiers de vacances
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <AdminFileImport category="notebooks" item="fr" title="Cahier de vacances (FR)" />
                <AdminFileImport category="notebooks" item="en" title="Cahier de vacances (EN)" />
            </CardContent>
        </Card>
    );
};
