import { useEffect, useState } from "react";
import { checkSDIStatus } from "../../services/requests/event.service";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const SdiSection = () => {
  const [isSDIOpen, setIsSDIOpen] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.billetweb.fr/js/export.js";
    script.async = true;
    document.body.appendChild(script);

    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const status = await checkSDIStatus();
      setIsSDIOpen(status);
    } catch (error) {
      alert("Erreur lors de la récupération du statut de SDI.");
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto bg-gradient-to-br from-blue-100 to-purple-200">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
          🎉 Participe à la Soirée d'Intégration (SDI) !
        </CardTitle>
        <p className="text-lg md:text-xl text-gray-700 text-center">
          Un événement incroyable t'attend… Inscris-toi dès maintenant pour ne rien rater de cette Soirée d'Intégration !
        </p>
      </CardHeader>
      <CardContent className="space-y-10">
        {!isSDIOpen ? (
          <div className="surface-card p-6 text-center">
            <p className="text-xl text-red-600 font-semibold">
              🚫 La billetterie de la Soirée d'intégration (SDI) n'est pas encore disponible.
            </p>
            <p className="text-gray-600 mt-2">
              Reste connecté, elle ouvrira bientôt !
            </p>
          </div>
        ) : (
          <div className="surface-card overflow-hidden">
            <iframe
              title="Billetterie SDI"
              src="https://www.billetweb.fr/billetterie-soiree-dintegration-utt-2025"
              className="w-full h-[600px] border-none"
            />
          </div>
        )}
      </CardContent>
    </Card >
  );
};
