import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { getAllChallenges, getFactionsPoints } from "../../services/requests/challenge.service";
import { Challenge } from "../../interfaces/challenge.interface";

export const ChallengeList = () => {
  const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>([]);
  const [factionPoints, setFactionPoints] = useState<{ [key: number]: number } | null>(null);

  useEffect(() => {
    fetchChallenges();
    fetchFactionPoints();
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
      const faction1Points = await getFactionsPoints(1);
      const faction2Points = await getFactionsPoints(2);

      setFactionPoints({
        1: faction1Points,
        2: faction2Points,
      });
    } catch (err) {
      console.error("Erreur lors du chargement des points des factions", err);
    }
  };

  // Fonction utilitaire pour filtrer les challenges par catégorie
  const getChallengesByCategory = (category: string) => {
    return availableChallenges.filter((challenge) => challenge.category.toLowerCase() === category.toLowerCase());
  };

  // Liste des catégories à afficher
  const categories = ["Faction", "Team", "Individuel", "Autre"];

  return (
    <div className="flex flex-col items-center px-4 py-8 space-y-8 max-w-full min-h-screen mx-auto">
      {/* Points des Factions */}
      <Card className="w-full p-6 rounded-2xl shadow-md bg-blue-50 border border-blue-200 space-y-4 mb-8">
        <h2 className="text-3xl font-bold text-blue-800 text-center">🏅 Points des Factions</h2>
        <div className="text-center text-gray-700">
          {factionPoints !== null ? (
            <div className="space-y-4">
              <p className="text-xl font-semibold">Faction 1 : {factionPoints[1]} points</p>
              <p className="text-xl font-semibold">Faction 2 : {factionPoints[2]} points</p>
            </div>
          ) : (
            <p className="text-gray-500">Chargement des points...</p>
          )}
        </div>
      </Card>

      {/* Challenges disponibles */}
      <Card className="w-full p-6 rounded-2xl shadow-md space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center">🏆 Challenges disponibles</h2>

        {(availableChallenges.length === 0 || (availableChallenges.length === 1 && availableChallenges[0].category === 'Free')) ? (
          <p className="text-gray-500 text-center">Aucun challenge disponible pour le moment.</p>
        ) : (
          <div className="space-y-10">
            {categories.map((category) => {
              const filtered = getChallengesByCategory(category);
              if (filtered.length === 0) return null;

              return (
                <div key={category}>
                  <h3 className="text-2xl font-semibold text-indigo-600 mb-4">{category}</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                    {filtered.map((challenge) => (
                      <li
                        key={challenge.id}
                        className="bg-gray-100 py-4 px-6 rounded-xl border border-gray-300 shadow-sm hover:bg-gray-200 transition"
                      >
                        <h4 className="font-semibold text-lg">{challenge.title}</h4>
                        <p className="text-gray-600 mt-2">{challenge.description}</p>
                        <div className="mt-2 text-gray-500 text-sm">
                          <p><strong>Catégorie :</strong> {challenge.category}</p>
                          <p><strong>Points :</strong> {challenge.points}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
