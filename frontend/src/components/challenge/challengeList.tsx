import { useEffect, useState } from "react";
import { Card } from "../../styles/components/ui/card";
import { getAllChallenges, getFactionsPoints } from "../../services/requests/challenge.service";
import { Challenge } from "../../interfaces/challenge.interface"; // L'interface pour le challenge

export const ChallengeList = () => {
  const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>([]);
  const [factionPoints, setFactionPoints] = useState<{ [key: number]: number } | null>(null); // État pour les points des factions (clé = factionId, valeur = points)

  useEffect(() => {
    fetchChallenges();
    fetchFactionPoints(); // Récupérer les points des factions au chargement de la page
  }, []);

  const fetchChallenges = async () => {
    try {
      const challenges = await getAllChallenges();
      setAvailableChallenges(challenges);
    } catch (err) {
      console.error("Erreur lors du chargement des challenges", err);
    }
  };

  const fetchFactionPoints = async () => {
    try {
      // Récupérer les points pour plusieurs factions
      const faction1Points = await getFactionsPoints(1);
      const faction2Points = await getFactionsPoints(2);
      
      // Mettre à jour l'état avec les points des deux factions
      setFactionPoints({
        1: faction1Points,
        2: faction2Points,
      });
    } catch (err) {
      console.error("Erreur lors du chargement des points des factions", err);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-8 space-y-8 max-w-full min-h-screen mx-auto">
      {/* Section Points des Factions */}
      <Card className="w-full p-6 rounded-2xl shadow-md bg-blue-50 border border-blue-200 space-y-4 mb-8">
        <h2 className="text-3xl font-bold text-blue-800 text-center">🏅 Points des Factions</h2>
        <div className="text-center text-gray-700">
          {factionPoints !== null ? (
            <div className="space-y-4">
              {/* Affichage des points des factions */}
              <p className="text-xl font-semibold">Faction 1 : {factionPoints[1]} points</p>
              <p className="text-xl font-semibold">Faction 2 : {factionPoints[2]} points</p>
            </div>
          ) : (
            <p className="text-gray-500">Chargement des points...</p>
          )}
        </div>
      </Card>

      {/* Section Challenges disponibles */}
      <Card className="w-full p-6 rounded-2xl shadow-md space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center">🏆 Challenges disponibles</h2>
        {availableChallenges.length === 0 ? (
          <p className="text-gray-500 text-center">Aucun challenge disponible pour le moment.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
            {availableChallenges.map((challenge) => (
              <li
                key={challenge.id}
                className="bg-gray-100 py-4 px-6 rounded-xl border border-gray-300 shadow-sm hover:bg-gray-200 transition"
              >
                <h3 className="font-semibold text-lg">{challenge.title}</h3>
                <p className="text-gray-600 mt-2">{challenge.description}</p>
                <div className="mt-2 text-gray-500 text-sm">
                  <p><strong>Catégorie :</strong> {challenge.category}</p>
                  <p><strong>Points :</strong> {challenge.points}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};
