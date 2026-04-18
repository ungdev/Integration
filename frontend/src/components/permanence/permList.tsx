import { Button } from "../ui/button";
import { Permanence } from "../../interfaces/permanence.interface";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AvailablePermanencesListProps {
  permanences: Permanence[];
  myPermanences: Permanence[];
  isSubmitting: boolean;
  onApply: (permId: number) => void;
}

export const AvailablePermanencesList: React.FC<AvailablePermanencesListProps> = ({
  permanences,
  myPermanences,
  isSubmitting,
  onApply,
}) => {
  // Tri global par date
  const sortedOpenPermanences = [...permanences]
    .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
    .filter((perm) => !myPermanences.some((myPerm) => myPerm.id === perm.id));

  // Groupement par jour
  const groupedByDay = sortedOpenPermanences.reduce((groups: Record<string, Permanence[]>, perm) => {
    const dateKey = format(new Date(perm.start_at), "EEEE dd MMMM", { locale: fr }); // Exemple : "lundi 23 août"
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(perm);
    return groups;
  }, {});

  return (
    <section>
      <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        📅 Permanences disponibles
      </h2>

      {sortedOpenPermanences.length > 0 ? (
        <div className="flex flex-col gap-8">
          {Object.entries(groupedByDay).map(([day, perms]) => (
            <div key={day}>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
                {day.charAt(0).toUpperCase() + day.slice(1)} {/* met la majuscule */}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {perms.map((perm) => (
                  <div
                    key={perm.id}
                    className="surface-card p-6 hover:shadow-lg transition duration-200 flex flex-col justify-between"
                  >
                    <div className="flex-1 mb-4">
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">{perm.name}</h4>
                      <p className="text-gray-600"><strong>📍 Lieu :</strong> {perm.location}</p>
                      <p className="text-gray-600"><strong>🕒 Début :</strong> {format(new Date(perm.start_at), "HH:mm")}</p>
                      <p className="text-gray-600"><strong>🕔 Fin :</strong> {format(new Date(perm.end_at), "HH:mm")}</p>
                      <p className="text-gray-600"><strong>👥 Capacité restante :</strong> {perm.capacity}</p>
                    </div>
                    <Button
                      onClick={() => onApply(perm.id)}
                      disabled={perm.capacity <= 0 || isSubmitting}
                      className={`w-full py-2 mt-2 text-white rounded-xl ${perm.capacity <= 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                      {perm.capacity <= 0 ? "Complet" : "S'inscrire"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">
          Aucune permanence disponible.
        </p>
      )}
    </section>
  );
};
