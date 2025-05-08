import { useEffect, useState } from "react";
import { checkPreRegisterStatus } from "../../services/requests/event.service";

export const PreregisterGform = () => {
  const [isPreRegistrationOpen, setIsPreRegistrationOpen] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await checkPreRegisterStatus();
        setIsPreRegistrationOpen(status);
      } catch (error) {
        alert("Erreur lors de la récupération du statut de pré-inscription.");
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 rounded-xl shadow-lg p-6 sm:p-8">
        {isPreRegistrationOpen ? (
          <>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center text-blue-700">
              Tu souhaites être CE à l'intégration ?
            </h2>
            <p className="text-base sm:text-lg text-gray-700 text-center mb-8">
              Alors remplis ce formulaire sans plus attendre pour nous montrer tes motivations !
            </p>

            <div className="relative pb-[56.25%] rounded-lg shadow overflow-hidden">
              <iframe
                src="https://forms.gle/sDATUvd32srA3AKr8"
                className="absolute inset-0 w-full h-full border-none"
                title="Formulaire de parrainage"
                loading="lazy"
              >
                Chargement…
              </iframe>
            </div>
          </>
        ) : (
          <p className="text-center text-red-500 text-lg font-semibold">
            La pré-inscription est actuellement fermée.
          </p>
        )}
      </div>
    </div>
  );
};
