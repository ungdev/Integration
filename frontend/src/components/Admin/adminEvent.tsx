import { useState, useEffect } from "react";
import { toggleShotgun, togglePreRegistration, checkShotgunStatus, checkPreRegisterStatus } from "../../services/requests/event.service";
import { Button } from "../../styles/components/ui/button";

export const AdminShotgun = () => {
  const [preRegistrationOpen, setPreRegistrationOpen] = useState(false);
  const [shotgunOpen, setShotgunOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStatuses, setLoadingStatuses] = useState(true); // Ajout d'un état de chargement pour les statuts

  // Récupérer les statuts de pré-inscription et de shotgun au montage du composant
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const preRegStatus = await checkPreRegisterStatus();
        const shotgunStatus = await checkShotgunStatus();
        
        // Mettre à jour les états avec les résultats récupérés
        setPreRegistrationOpen(preRegStatus);
        setShotgunOpen(shotgunStatus);
      } catch (error) {
        alert("Erreur lors de la récupération des statuts.");
      } finally {
        setLoadingStatuses(false); // Fin du chargement des statuts
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
    } catch (error) {
      alert("Erreur lors de la mise à jour de la pré-inscription.");
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
    } catch (error) {
      alert("Erreur lors de la mise à jour du shotgun.");
    } finally {
      setLoading(false);
    }
  };

  // Si les statuts sont en cours de chargement, on affiche un indicateur
  if (loadingStatuses) {
    return <div>Chargement des statuts...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Admin Panel - Shotgun CE</h2>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <span className="text-sm">Pré-inscription</span>
          <Button 
            variant={preRegistrationOpen ? "destructive" : "default"} 
            onClick={handleTogglePreRegistration}
            disabled={loading}
            style={{
              color: preRegistrationOpen ? 'white' : '', // Assure une couleur de texte visible pour "Activer"
              backgroundColor: preRegistrationOpen ? '#dc2626' : '', // Choix de couleur pour "Désactiver"
            }}
          >
            {preRegistrationOpen ? "Désactiver" : "Activer"}
          </Button>
        </div>

        <div className="flex items-center justify-between p-3 border rounded-lg">
          <span className="text-sm">Shotgun</span>
          <Button 
            variant={shotgunOpen ? "destructive" : "default"} 
            onClick={handleToggleShotgun}
            disabled={loading}
            style={{
              color: shotgunOpen ? 'white' : '', // Assure une couleur de texte visible pour "Activer"
              backgroundColor: shotgunOpen ? '#dc2626' : '', // Choix de couleur pour "Désactiver"
            }}
          >
            {shotgunOpen ? "Désactiver" : "Activer"}
          </Button>
        </div>
      </div>
    </div>
  );
};
