import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { respoDetails, claimedMember } from "../../services/requests/permanence.service";
import { Permanence } from "../../interfaces/permanence.interface";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle, XCircle, Circle } from "lucide-react";
import Swal from "sweetalert2";

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  claimed: boolean; // Ici : true = Présent, false = Absent, undefined = non noté
}

interface PermanenceWithMembers extends Permanence {
  members: Member[];
}

export const RespoPresenceManagement = () => {
  const [permanences, setPermanences] = useState<PermanenceWithMembers[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedPermId, setExpandedPermId] = useState<number | null>(null);

  useEffect(() => {
    fetchRespoPermanences();
  }, []);

  const fetchRespoPermanences = async () => {
    try {
      const result = await respoDetails();

      const formatted: PermanenceWithMembers[] = result.data
        .filter((item: any) => item.permanence)
        .map((item: any) => ({
          ...item.permanence,
          members: item.members || [],
        }));

      // tri par date début
      formatted.sort(
        (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
      );

      setPermanences(formatted);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Chargement échoué',
        text: "Impossible de récupérer les permanences du responsable.",
      });

    } finally {
      setLoading(false);
    }
  };

  const handlePresence = async (userId: number, permId: number, present: boolean) => {
    try {
      await claimedMember(userId, permId, present);
      fetchRespoPermanences();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Mise à jour échouée',
        text: "Une erreur est survenue lors de la mise à jour de la présence.",
      });

    }
  };

  const toggleExpand = (permId: number) => {
    setExpandedPermId((prev) => (prev === permId ? null : permId));
  };

  // Regroupement par jour
  const groupedByDay = permanences.reduce((acc: any, perm) => {
    const day = format(new Date(perm.start_at), "EEEE dd MMMM", { locale: fr });
    if (!acc[day]) acc[day] = [];
    acc[day].push(perm);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800 text-center">
            ✅ Gestion des présences
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-12">
          {loading ? (
            <p className="text-center text-gray-500 animate-pulse">Chargement...</p>
          ) : Object.keys(groupedByDay).length === 0 ? (
            <p className="text-center text-gray-400">Aucune permanence trouvée.</p>
          ) : (
            Object.keys(groupedByDay).map((day) => (
              <div key={day} className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-1">
                  📅 {day}
                </h3>

                {groupedByDay[day].map((perm: PermanenceWithMembers) => (
                  <Card
                    key={`perm-${perm.id}`}
                    className="w-full max-w-3xl mx-auto py-0"
                  >
                    {/* Header collapsible */}
                    <button
                      onClick={() => toggleExpand(perm.id)}
                      className="w-full flex justify-between items-center px-6 py-6 bg-transparent hover:bg-black/5 transition"
                    >
                      <div className="text-left">
                        <h4 className="text-md font-semibold text-gray-800">
                          📍 {perm.name ?? "Nom inconnu"}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {perm.location ?? "Lieu inconnu"} —{" "}
                          {format(new Date(perm.start_at), "HH:mm", { locale: fr })} →{" "}
                          {format(new Date(perm.end_at), "HH:mm", { locale: fr })}
                        </p>
                      </div>
                      <span className="text-xl text-gray-500">
                        {expandedPermId === perm.id ? "▲" : "▼"}
                      </span>
                    </button>

                    {/* Liste des membres */}
                    {expandedPermId === perm.id && (
                      <div className="px-6 pb-6">
                        {perm.members.length === 0 ? (
                          <p className="text-center text-gray-400 mt-4">
                            Aucun membre inscrit.
                          </p>
                        ) : (
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            {perm.members.map((member) => (
                              <li
                                key={`member-${perm.id}-${member.id}`}
                                className="flex items-center justify-between surface-card px-4 py-2"
                              >
                                <div className="flex items-center gap-2">
                                  {member.claimed === true && (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  )}
                                  {member.claimed === false && (
                                    <XCircle className="w-5 h-5 text-red-600" />
                                  )}
                                  {member.claimed === undefined && (
                                    <Circle className="w-5 h-5 text-gray-400" />
                                  )}
                                  <span className="text-sm text-gray-700">
                                    {member.first_name} {member.last_name}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handlePresence(member.id, perm.id, true)}
                                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                                  >
                                    Présent
                                  </Button>
                                  <Button
                                    onClick={() => handlePresence(member.id, perm.id, false)}
                                    className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1"
                                  >
                                    Absent
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};