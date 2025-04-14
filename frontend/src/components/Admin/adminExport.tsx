import  { useState } from "react";
import { Button } from "../ui/button";
import { exportDb } from "../../services/requests/export.service";

export const AdminExportConnect = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string>(""); // État pour vérifier si l'utilisateur est authentifié

  
  
    const handleExport = async () => {
      setLoading(true);
      try {
        // Appel au backend pour récupérer l'URL d'authentification
        const response = await exportDb();
        setMessage(response.message);
      } catch (error) {
        console.error("Erreur de connexion à Google", error);
        setError("Erreur lors de la tentative de connexion.");
      } finally {
        setLoading(false);
      }
    };
  
    if (loading) {
      return <div>Chargement...</div>;
    }
  
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Export vers Google Sheets</h2>
          <>
            <div className="flex justify-center">
              <Button 
                onClick={handleExport}
                disabled={loading}
                className="bg-blue-500 text-white hover:bg-blue-600 p-3 rounded-md"
              >
                {loading ? 'Chargement...' : 'Export vers Google Sheets'}
              </Button>
            </div>
          </>
        {error && <div className="text-red-500 text-center">{error}</div>}
        {message && <div className="text-green-500 text-center">{message}</div>}
      </div>
    );
  };
