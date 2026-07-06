import { useState } from 'react';

import { importPermanenceCSV } from '../../../services/requests/permanence.service';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

export const ImportPermCSV = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleFileUpload = async () => {
        if (!file) {
            setMessage('Veuillez sélectionner un fichier CSV.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await importPermanenceCSV(formData);
            setMessage(response.message);
        } catch (error) {
            console.error(error);
            setMessage("Erreur lors de l'import du fichier CSV.");
        }
    };

    return (
        <Card className="w-full max-w-7xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    Importer un fichier CSV pour les permanences
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
                <p className="text-center text-gray-500 text-sm">
                    Uploadez un fichier CSV contenant les permanences à importer.
                </p>

                <div className="flex flex-col items-center gap-4">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="file-input w-full max-w-md text-sm file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />

                    <Button
                        onClick={handleFileUpload}
                        className="w-full max-w-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-xl font-semibold transition shadow-md">
                        📥 Importer le fichier
                    </Button>
                </div>

                {message && (
                    <p
                        className={`text-center text-sm font-medium ${
                            message.toLowerCase().includes('succès') ? 'text-green-600' : 'text-red-500'
                        }`}>
                        {message}
                    </p>
                )}

                <Card className="text-sm text-gray-700">
                    <CardHeader>
                        <CardTitle className="font-semibold text-gray-800 text-lg">
                            📄 Exemple de fichier CSV :
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-white p-4 rounded-lg border text-xs overflow-x-auto">
                            {`name,description,location,start_at,end_at,capacity,difficulty,
Permanence 1,Accueil matin,A001,2025-05-01T08:00,2025-05-01T10:00,3,10
Permanence 2,Accueil après-midi,A002,2025-05-02T14:00,2025-05-02T16:00,4,15`}
                        </pre>
                        <p className="mt-4 text-xs text-gray-500">
                            Le fichier doit être encodé en UTF-8 et utiliser une virgule comme séparateur. Les dates
                            doivent être au format
                            <code className="ml-1 font-mono bg-gray-200 px-1 rounded">aaaa-mm-jjThh:mm</code>.
                        </p>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
};
