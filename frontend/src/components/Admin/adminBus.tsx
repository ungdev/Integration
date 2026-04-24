import { useState } from "react";
import Swal from "sweetalert2";

import { busAttribution, importBusCSV } from "../../services/requests/bus.service";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const AdminBusTools = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>("");

    // 📤 Envoi des emails d'attribution bus
    const handleSendBusAttribution = async () => {
        const confirm = await Swal.fire({
            title: "Envoyer les attributions de bus ?",
            text: "Tous les utilisateurs recevront leur email d'attribution.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#d33",
            confirmButtonText: "🚍 Oui, envoyer",
            cancelButtonText: "Annuler",
        });

        if (confirm.isConfirmed) {
            try {
                const res = await busAttribution();
                Swal.fire({
                    title: "Succès ✅",
                    text: res?.msg || "Emails envoyés avec succès !",
                    icon: "success",
                });
            } catch (error: any) {
                Swal.fire({
                    title: "Erreur ❌",
                    text: error?.response?.data?.msg || "Une erreur est survenue.",
                    icon: "error",
                });
            }
        }
    };

    // 📥 Import CSV bus
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleFileUpload = async () => {
        if (!file) {
            setMessage("Veuillez sélectionner un fichier CSV.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await importBusCSV(formData);
            setMessage(response.message);
        } catch (error) {
            console.error(error);
            setMessage("Erreur lors de l'import du fichier CSV.");
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    🚍 Outils d'administration des Bus
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10">

                {/* Section attribution */}
                <div className="space-y-3 text-center">
                    <h3 className="text-xl font-semibold text-gray-800">
                        ✉️ Envoyer les attributions
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Envoie les emails d'attribution de bus à tous les utilisateurs.
                    </p>
                    <div className="flex justify-center">
                        <Button
                            onClick={handleSendBusAttribution}
                            className="bg-gradient-to-r from-indigo-500 to-indigo-600 
                       hover:from-indigo-600 hover:to-indigo-700 
                       text-white py-2.5 px-6 rounded-xl font-semibold 
                       transition shadow-md"
                        >
                            Envoyer les emails
                        </Button>
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Section import CSV */}
                <div className="space-y-4 text-center">
                    <h3 className="text-xl font-semibold text-gray-800">
                        📥 Importer un fichier CSV
                    </h3>
                    <p className="text-gray-500 text-sm">
                        Chargez un fichier CSV contenant les attributions de bus.
                    </p>

                    <div className="flex flex-col items-center gap-4">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="file-input w-full max-w-md text-sm 
                       file:py-2 file:px-4 file:rounded-lg file:border-0 
                       file:bg-blue-600 file:text-white 
                       hover:file:bg-blue-700"
                        />

                        <Button
                            onClick={handleFileUpload}
                            className="w-full max-w-md bg-gradient-to-r from-blue-500 to-blue-600 
                       hover:from-blue-600 hover:to-blue-700 
                       text-white py-2.5 rounded-xl font-semibold transition shadow-md"
                        >
                            Importer CSV
                        </Button>
                    </div>

                    {message && (
                        <p
                            className={`text-center text-sm font-medium ${message.toLowerCase().includes("succès")
                                ? "text-green-600"
                                : "text-red-500"
                                }`}
                        >
                            {message}
                        </p>
                    )}
                </div>

                <hr className="border-gray-200" />

                {/* Exemple CSV */}
                <Card className="text-sm text-gray-700">
                    <CardHeader>
                        <CardTitle className="font-semibold text-gray-800 text-lg">
                            📄 Exemple de fichier CSV :
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-white p-4 rounded-lg border text-xs overflow-x-auto">
                            {`user_id,bus,departure_time
1,2,11h
2,3,13h
3,1,11h`}
                        </pre>
                        <p className="mt-4 text-xs text-gray-500">
                            Le fichier doit être encodé en UTF-8 et utiliser une virgule comme séparateur.
                        </p>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
};
