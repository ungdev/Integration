import { useEffect, useState } from "react";
import { checkSDIStatus } from "../../services/requests/event.service";

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
    <section className="w-full min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 py-12 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            🎉 Participe à la Soirée d'Intégration (SDI) !
          </h2>
          <p className="text-lg md:text-xl text-gray-700">
            Un événement incroyable t’attend… Inscris-toi dès maintenant pour ne rien rater de cette Soirée d’Intégration 2025 !
          </p>
        </div>

        {!isSDIOpen ? (
          <div className="bg-white shadow-xl rounded-2xl p-6">
            <p className="text-xl text-red-600 font-semibold">
              🚫 La billetterie de la Soirée d'intégration(SDI) n’est pas encore disponible.
            </p>
            <p className="text-gray-600 mt-2">
              Reste connecté, elle ouvrira bientôt !
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <iframe
              title="Billetterie WEI"
              src="https://www.billetweb.fr/billetterie-soiree-dintegration-utt-2025"
              className="w-full h-[600px] border-none"
            />
          </div>
        )}
      </div>
    </section>
  );
};
