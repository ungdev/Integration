import { useState } from 'react';

import { exportBus, exportDb, exportTeamMembers } from '../../services/requests/im_export.service';
import { downloadJsonAsCsv } from '../../utils/utils';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AdminFileImport } from './adminFileImport';

type ExportType = 'db' | 'bus' | 'teamMembers';

export const AdminExportConnect = () => {
    const [loading, setLoading] = useState<Record<ExportType, boolean>>({
        db: false,
        bus: false,
        teamMembers: false,
    });

    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string>('');

    const handleExportDb = async () => {
        setLoading((prev) => ({ ...prev, db: true }));
        setError(null);
        setMessage('');

        try {
            const response = await exportDb();
            setMessage(response.message);
        } catch (err) {
            console.error('Erreur export db', err);
            setError("Erreur lors de l'export vers Google Sheets.");
        } finally {
            setLoading((prev) => ({ ...prev, db: false }));
        }
    };

    const handleExportCsv = async (
        type: 'bus' | 'teamMembers',
        exportFn: () => Promise<Record<string, unknown>[]>,
        filename: string,
    ) => {
        setLoading((prev) => ({ ...prev, [type]: true }));
        setError(null);
        setMessage('');

        try {
            const exportData = await exportFn();

            downloadJsonAsCsv(exportData, `${filename}_${Date.now()}.csv`);

            setMessage('Export terminé avec succès.');
        } catch (err) {
            console.error(`Erreur export ${type}`, err);
            setError("Erreur lors de l'export.");
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
                    {/* Export DB → Google Sheets */}
                    <Button
                        onClick={handleExportDb}
                        disabled={loading.db}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-6 rounded-xl shadow-md transition-all duration-200">
                        {loading.db ? '⏳ Export en cours...' : 'Exporter vers Google Sheets'}
                    </Button>

                    {/* Export Bus → CSV */}
                    <Button
                        onClick={() => handleExportCsv('bus', exportBus, 'bus_export')}
                        disabled={loading.bus}
                        className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 px-6 rounded-xl shadow-md transition-all duration-200">
                        {loading.bus ? '⏳ Export en cours...' : 'Exporter les bus'}
                    </Button>

                    {/* Export Team Members → CSV */}
                    <Button
                        onClick={() => handleExportCsv('teamMembers', exportTeamMembers, 'team_members_export')}
                        disabled={loading.teamMembers}
                        className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 px-6 rounded-xl shadow-md transition-all duration-200">
                        {loading.teamMembers ? '⏳ Export en cours...' : 'Exporter les équipes'}
                    </Button>
                </div>

                {error && <p className="text-center text-sm text-red-500 font-medium animate-fade-in">{error}</p>}

                {message && !error && (
                    <p className="text-center text-sm text-green-600 font-medium animate-fade-in">✅ {message}</p>
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
                <AdminFileImport category="plannings" item="ri" title="Relations Internationales" />
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

export const AdminImportOther = () => {
    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">Autres imports</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <AdminFileImport category="other" item="parental_authorization" title="Autorisation parentale" />
            </CardContent>
        </Card>
    );
};
