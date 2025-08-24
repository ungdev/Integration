import { Button } from "../ui/button";
import { Permanence } from "../../interfaces/permanence.interface";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MyPermanencesListProps {
  myPermanences: Permanence[];
  onCancel: (permId: number) => void;
}

export const MyPermanencesList: React.FC<MyPermanencesListProps> = ({
  myPermanences,
  onCancel,
}) => {
  // Tri chronologique
  const sortedMyPermanences = [...myPermanences].sort(
    (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
  );

  // Regroupement par jour
  const groupedByDay = sortedMyPermanences.reduce(
    (groups: Record<string, Permanence[]>, perm) => {
      const dateKey = format(new Date(perm.start_at), "EEEE dd MMMM", {
        locale: fr,
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(perm);
      return groups;
    },
    {}
  );

  return (
    <section>
      <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
        ✅ Mes permanences
      </h2>

      {sortedMyPermanences.length > 0 ? (
        <div className="flex flex-col gap-8">
          {Object.entries(groupedByDay).map(([day, perms]) => (
            <div key={day}>
              <h3 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {perms.map((perm) => (
                  <div
                    key={perm.id}
                    className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition duration-200"
                  >
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      {perm.name}
                    </h4>
                    <p className="text-gray-600">
                      <strong>📍 Lieu :</strong> {perm.location}
                    </p>
                    <p className="text-gray-600">
                      <strong>🕒 Début :</strong>{" "}
                      {format(new Date(perm.start_at), "HH:mm")}
                    </p>
                    <p className="text-gray-600 mb-4">
                      <strong>🕔 Fin :</strong>{" "}
                      {format(new Date(perm.end_at), "HH:mm")}
                    </p>
                    <Button
                      onClick={() => onCancel(perm.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
                    >
                      Se désinscrire
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center">
          Aucune permanence à laquelle vous êtes inscrit.
        </p>
      )}
    </section>
  );
};
