import { useState, useEffect } from "react";
import { toggleShotgun, togglePreRegistration, checkShotgunStatus, checkPreRegisterStatus } from "../../services/requests/event.service";
import { Button } from "../../styles/components/ui/button";

export const AdminShotgun = () => {
  const [preRegistrationOpen, setPreRegistrationOpen] = useState(false);
  const [shotgunOpen, setShotgunOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStatuses, setLoadingStatuses] = useState(true);

  // Récupérer les statuts de pré-inscription et de shotgun au montage du composant
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const preRegStatus = await checkPreRegisterStatus();
        const shotgunStatus = await checkShotgunStatus();
        
        setPreRegistrationOpen(preRegStatus);
        setShotgunOpen(shotgunStatus);
      } catch (error) {
        alert("Erreur lors de la récupération des statuts.");
      } finally {
        setLoadingStatuses(false);
      }
    };
    fetchStatuses();
  }, []);

  const handleTogglePreRegistration = async () => {
    setLoading(true);
    try {
      await togglePreRegistration(!preRegistrationOpen);
      setPreRegistrationOpen(!preRegistrationOpen);
      alert("Pré-inscription mise à jour !");
    } catch (error : any) {
      alert(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleShotgun = async () => {
    setLoading(true);
    try {
      await toggleShotgun(!shotgunOpen);
      setShotgunOpen(!shotgunOpen);
      alert("Shotgun mis à jour !");
    } catch (error : any) {
      alert(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // Si les statuts sont en cours de chargement, on affiche un indicateur
  if (loadingStatuses) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-600">Chargement des statuts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Gestion des Événements Shotgun</h2>

      <div className="space-y-4">
        {/* Pré-inscription */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
          <span className="text-sm text-gray-600">Pré-inscription</span>
          <Button 
            variant={preRegistrationOpen ? "destructive" : "default"} 
            onClick={handleTogglePreRegistration}
            disabled={loading}
            className={`transition-colors duration-300 ${
              preRegistrationOpen ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-500 text-white hover:bg-blue-600'
            } p-2 rounded-md`}
          >
            {preRegistrationOpen ? "Désactiver" : "Activer"}
          </Button>
        </div>

        {/* Shotgun */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
          <span className="text-sm text-gray-600">Shotgun</span>
          <Button 
            variant={shotgunOpen ? "destructive" : "default"} 
            onClick={handleToggleShotgun}
            disabled={loading}
            className={`transition-colors duration-300 ${
              shotgunOpen ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-blue-500 text-white hover:bg-blue-600'
            } p-2 rounded-md`}
          >
            {shotgunOpen ? "Désactiver" : "Activer"}
          </Button>
        </div>
      </div>
    </div>
  );
};
