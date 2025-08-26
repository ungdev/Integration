import { useEffect, useState } from "react";
import { checkFoodStatus } from "../../services/requests/event.service";
import { getPermission } from "../../services/requests/user.service";

export const FoodSection = () => {
  const [isFoodOpen, setIsFoodOpen] = useState(false);
  const [isMenuAvailable, setIsMenuAvailable] = useState(false);

  const permission = getPermission();
  const menuUrl = "https://integration.utt.fr/api/uploads/foodmenu/FoodMenu.pdf";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.billetweb.fr/js/export.js";
    script.async = true;
    document.body.appendChild(script);

    fetchStatus();
    checkMenuAvailability();
  }, []);

  const fetchStatus = async () => {
    try {
      const status = await checkFoodStatus();
      setIsFoodOpen(status);
    } catch (error) {
      alert("Erreur lors de la récupération du statut de la nourriture.");
    }
  };

  const checkMenuAvailability = async () => {
    try {
      const response = await fetch(menuUrl, { method: "HEAD" });
      if (response.ok) {
        setIsMenuAvailable(true);
      }
    } catch (error) {
      // Ne rien faire si le fichier n'est pas disponible
    }
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 py-12 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Prends tes repas pour la semaine d'Intégration !
          </h2>
          <p className="text-lg md:text-xl text-gray-700">
            Réserve dès maintenant tes repas servi pendant la semaine d'Intégration !
          </p>
        </div>

        {/* Visualiseur PDF si disponible */}
        {isMenuAvailable && (
          <div className="bg-white shadow-xl rounded-2xl p-6 space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800">📄 Menu de la semaine</h3>
            <iframe
              src={menuUrl}
              title="Menu PDF"
              className="w-full h-[600px] border"
            />
            <a
              href={menuUrl}
              download
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
            >
              Télécharger le menu
            </a>
          </div>
        )}

        {/* Billetterie */}
        {!isFoodOpen ? (
          <div className="bg-white shadow-xl rounded-2xl p-6">
            <p className="text-xl text-red-600 font-semibold">
              🚫 La billetterie des repas n’est pas encore disponible.
            </p>
            <p className="text-gray-600 mt-2">
              Reste connecté, elle ouvrira bientôt !
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <iframe
                title="Billetterie Nourriture"
                src="https://www.billetweb.fr/billetterie-repas-semaine-inte-a25"
                className="w-full h-[600px] border-none"
              />
            </div>
            {(permission === "Student" || permission === "Admin") && (
              <div className="bg-white shadow-xl rounded-2xl p-6 space-y-4">
                <p className="text-xl text-red-600 font-semibold">
                  La billetterie du repas test est réservée aux Chefs d'Equipe et Organisateurs de l'Intégration 2025.
                </p>
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                  <iframe
                    title="Billetterie Nourriture Test"
                    src="https://www.billetweb.fr/billetterie-repas-test-a25"
                    className="w-full h-[600px] border-none"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
