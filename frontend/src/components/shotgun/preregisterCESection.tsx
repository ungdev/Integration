import { useEffect, useState } from "react";
import { checkPreRegisterStatus } from "../../services/requests/event.service";

export const PreregisterCESection = () => {
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
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 rounded-xl shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold mb-1 text-center text-gray-800">
        Pré-inscription personnelle
      </h2>
      <p className="text-center text-gray-600 mb-4">
        Une réponse <u>par étudiant</u>
      </p>

      {isPreRegistrationOpen ? (
        <>
          <div className="relative pb-[56.25%] rounded-lg shadow overflow-hidden mb-4">
            <iframe
              src="https://forms.gle/32yHKGSTzfFvp7NP9"
              className="absolute inset-0 w-full h-full border-none"
              title="Formulaire de pré-inscription CE"
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
  );
};
