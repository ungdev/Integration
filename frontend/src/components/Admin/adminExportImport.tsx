import { useState } from "react";
import { Button } from "../ui/button";
import { exportDb } from "../../services/requests/export.service";
import { importPermanenceCSV } from "../../services/requests/permanence.service";

export const AdminExportConnect = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await exportDb();
      setMessage(response.message);
    } catch (error) {
      console.error("Erreur de connexion à Google", error);
      setError("Erreur lors de la tentative de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
        Exporter vers Google Sheets
      </h2>

      <div className="flex justify-center mb-4">
        <Button
          onClick={handleExport}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-6 rounded-xl shadow-md transition-all duration-200"
        >
          {loading ? "Chargement..." : "Exporter les données"}
        </Button>
      </div>

      {error && (
        <p className="text-center text-sm text-red-500 font-medium">{error}</p>
      )}
      {message && (
        <p className="text-center text-sm text-green-600 font-medium">
          {message}
        </p>
      )}
    </div>
  );
};

export const ImportPermCSV = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

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
      const response = await importPermanenceCSV(formData);
      setMessage(response.message);
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de l'import du fichier CSV.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-12 space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 text-center">
        Importer un fichier CSV pour les permanences
      </h2>

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
          className="w-full max-w-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-xl font-semibold transition shadow-md"
        >
          📥 Importer le fichier
        </Button>
      </div>

      {message && (
        <p
          className={`text-center text-sm font-medium ${
            message.toLowerCase().includes("succès")
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-sm text-gray-700">
        <h3 className="font-semibold text-gray-800 mb-2 text-lg">
          📄 Exemple de fichier CSV :
        </h3>
        <pre className="bg-white p-4 rounded-lg border text-xs overflow-x-auto">
          {`name,description,location,start_at,end_at,capacity,is_open
Permanence 1,Accueil matin,A001,2025-05-01T08:00,2025-05-01T10:00,10,false
Permanence 2,Accueil après-midi,A002,2025-05-02T14:00,2025-05-02T16:00,15,false`}
        </pre>
        <p className="mt-4 text-xs text-gray-500">
          Le fichier doit être encodé en UTF-8 et utiliser une virgule comme séparateur. Les dates doivent être au format
          <code className="ml-1 font-mono bg-gray-200 px-1 rounded">
            aaaa-mm-jjThh:mm
          </code>.
        </p>
      </div>
    </div>
  );
};
