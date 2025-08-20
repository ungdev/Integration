import { useEffect, useState } from "react";

type Planning = {
  name: string;
  url: string;
};

const plannings: Planning[] = [
  {
    name: "Planning TC",
    url: "http://localhost:4001/api/uploads/plannings/tc.pdf",
  },
  {
    name: "Planning Branche (non-alternant)",
    url: "https://integration.utt.fr/api/uploads/plannings/branche.pdf",
  },
  {
    name: "Planning Branche FISEA (alternants)",
    url: "https://integration.utt.fr/api/uploads/plannings/fisea.pdf",
  },
  {
    name: "Planning Master",
    url: "https://integration.utt.fr/api/uploads/plannings/master.pdf",
  },
];

export const PlanningSection = () => {
  const [availablePlannings, setAvailablePlannings] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const checkAvailability = async () => {
      const availability: Record<string, boolean> = {};
      for (const planning of plannings) {
        try {
          const response = await fetch(planning.url, { method: "HEAD" });
          availability[planning.name] = response.ok;
        } catch {
          availability[planning.name] = false;
        }
      }
      setAvailablePlannings(availability);
    };

    checkAvailability();
  }, []);

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 py-12 px-4 flex items-center justify-center">
      <div className="max-w-6xl w-full space-y-12">
        {/* Titre principal */}
        <div className="space-y-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            📅 Consulte les plannings de la semaine d'Intégration
          </h2>
          <p className="text-lg md:text-xl text-gray-700">
            Retrouve ici tous les plannings (TC, Branche, FISEA, Master) et
            télécharge-les.
          </p>
        </div>

        {/* Affichage un par un */}
        {plannings.map((planning) => (
          <div
            key={planning.name}
            className="bg-white shadow-xl rounded-2xl p-6 space-y-6"
          >
            {/* Titre planning centré */}
            <h3 className="text-2xl font-semibold text-gray-800 text-center">
              {planning.name}
            </h3>

            {availablePlannings[planning.name] ? (
              <>
                {/* PDF scrollable horizontal */}
                <div className="overflow-x-auto">
                  <iframe
                    src={planning.url}
                    title={planning.name}
                    className="w-full min-h-[600px] border rounded-lg"
                  />
                </div>

                {/* Bouton centré */}
                <div className="flex justify-center">
                  <a
                    href={planning.url}
                    download
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
                  >
                    Télécharger le planning
                  </a>
                </div>
              </>
            ) : (
              <p className="text-red-500 font-medium text-center">
                🚫 Ce planning n’est pas encore disponible.
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
