import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  getOpenPermanences,
  getMyPermanences,
  applyToPermanence,
  cancelPermanence,
} from "../../services/requests/permanence.service";
import { Permanence } from "../../interfaces/permanence.interface";
import { formatDateForDisplay } from "../utils/datetime_utils";

export const PagePermanence: React.FC = () => {
  const [permanences, setPermanences] = useState<Permanence[]>([]);
  const [myPermanences, setMyPermanences] = useState<Permanence[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    refreshAllPermanences();
  }, []);

  const refreshAllPermanences = () => {
    fetchOpenPermanences();
    fetchMyPermanences();
  };

  const fetchOpenPermanences = async () => {
    try {
      const perms = await getOpenPermanences();
      setPermanences(perms);
    } catch (err) {
      console.error("Erreur lors du chargement des permanences ouvertes", err);
    }
  };

  const fetchMyPermanences = async () => {
    try {
      const perms = await getMyPermanences();
      setMyPermanences(perms);
    } catch (err) {
      console.error("Erreur lors du chargement des permanences de l'utilisateur", err);
    }
  };

  const handleApplyToPermanence = async (permId: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await applyToPermanence(permId);
      alert(response.message);
      refreshAllPermanences();
    } catch (err) {
      console.error("Erreur lors de l'inscription à la permanence", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelPermanence = async (permId: number) => {
    const selectedPermanence = myPermanences.find((perm) => perm.id === permId);
    if (!selectedPermanence) {
      alert("Permanence non trouvée.");
      return;
    }

    const now = new Date();
    const deadline = new Date(selectedPermanence.start_at);
    deadline.setDate(deadline.getDate() - 1);

    if (now > deadline) {
      alert("La désinscription n'est plus possible.");
      return;
    }

    if (!confirm("Êtes-vous sûr de vouloir vous désinscrire ?")) return;

    try {
      const response = await cancelPermanence(permId);
      alert(response.message);
      refreshAllPermanences();
    } catch (err) {
      console.error("Erreur lors de l'annulation de la permanence", err);
    }
  };

  const sortedOpenPermanences = [...permanences].sort(
    (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
  );

  const sortedMyPermanences = [...myPermanences].sort(
    (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
  );

  return (
        <div className="min-h-screen flex justify-center bg-gray-50 py-10 px-4">
          <div className="w-full max-w-6xl flex flex-col gap-12">
            {/* Permanences disponibles */}
            <section>
              <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
                📅 Permanences disponibles
              </h2>
              {sortedOpenPermanences.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sortedOpenPermanences.map((perm) => {
                    const isAlreadyRegistered = myPermanences.some((myPerm) => myPerm.id === perm.id);
                    if (isAlreadyRegistered) return null;
      
                    return (
                      <div
                        key={perm.id}
                        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
                      >
                        <div className="flex-1 mb-4">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">{perm.name}</h3>
                          <p className="text-gray-600 mb-1"><strong>📍 Lieu :</strong> {perm.location}</p>
                          <p className="text-gray-600 mb-1"><strong>🕒 Début :</strong> {formatDateForDisplay(perm.start_at)}</p>
                          <p className="text-gray-600 mb-1"><strong>🕔 Fin :</strong> {formatDateForDisplay(perm.end_at)}</p>
                          <p className="text-gray-600"><strong>👥 Capacité restante :</strong> {perm.capacity}</p>
                        </div>
                        <Button
                          onClick={() => handleApplyToPermanence(perm.id)}
                          disabled={perm.capacity <= 0 || isSubmitting}
                          className={`w-full py-2 mt-2 text-white rounded-md ${
                            perm.capacity <= 0
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {perm.capacity <= 0 ? "Complet" : "S'inscrire"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600 text-center">Aucune permanence disponible.</p>
              )}
            </section>
      
            {/* Mes permanences */}
            <section>
              <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
                ✅ Mes permanences
              </h2>
              {sortedMyPermanences.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sortedMyPermanences.map((perm) => (
                    <div
                      key={perm.id}
                      className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200"
                    >
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{perm.name}</h3>
                      <p className="text-gray-600 mb-1"><strong>📍 Lieu :</strong> {perm.location}</p>
                      <p className="text-gray-600 mb-1"><strong>🕒 Début :</strong> {formatDateForDisplay(perm.start_at)}</p>
                      <p className="text-gray-600 mb-4"><strong>🕔 Fin :</strong> {formatDateForDisplay(perm.end_at)}</p>
                      <Button
                        onClick={() => handleCancelPermanence(perm.id)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
                      >
                        Se désinscrire
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center">Aucune permanence à laquelle vous êtes inscrit.</p>
              )}
            </section>
          </div>
        </div>
    );
};
