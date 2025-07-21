import { useEffect, useState, useMemo } from "react";
import { Card } from "../ui/card";
import { getAllChallenges, getFactionsPoints } from "../../services/requests/challenge.service";
import { Challenge } from "../../interfaces/challenge.interface";
import { getAllFactions } from "../../services/requests/faction.service";
import { Faction } from "../../interfaces/faction.interface";

export const ChallengeList = () => {
  const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>([]);
  const [factions, setFactions] = useState<Faction[]>([]);
  const [factionPoints, setFactionPoints] = useState<{ [key: number]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    await Promise.all([fetchChallenges(), fetchFactions()]);
    await fetchFactionPoints();
  };

  const fetchChallenges = async () => {
    try {
      const challenges = await getAllChallenges();
      setAvailableChallenges(challenges);
    } catch (err) {
      console.error("Erreur lors du chargement des challenges", err);
    }
  };

  const fetchFactions = async () => {
    try {
      const data = await getAllFactions();
      setFactions(data);
    } catch (err) {
      console.error("Erreur lors du chargement des factions", err);
    }
  };

  const fetchFactionPoints = async () => {
    try {
      const points: { [key: number]: number } = {};
      const fetchedFactions = await getAllFactions();
      await Promise.all(
        fetchedFactions.map(async (faction : Faction) => {
          const res = await getFactionsPoints(faction.factionId);
          points[faction.factionId] = res.points ?? 0;
        })
      );
      setFactionPoints(points);
    } catch (err) {
      console.error("Erreur lors du chargement des points des factions", err);
    }
  };

  const dynamicCategories = useMemo(() => {
    const uniqueCategories = new Set(availableChallenges.map(c => c.category));
    return ["Tous", ...Array.from(uniqueCategories)];
  }, [availableChallenges]);

  const filteredAndSortedChallenges = useMemo(() => {
    let challenges = [...availableChallenges];

    if (selectedCategory !== "Tous") {
      challenges = challenges.filter(c => c.category === selectedCategory);
    }

    challenges.sort((a, b) => sortOrder === "asc" ? a.points - b.points : b.points - a.points);

    return challenges;
  }, [availableChallenges, selectedCategory, sortOrder]);

  return (
    <div className="flex flex-col items-center px-4 py-8 space-y-8 max-w-full min-h-screen mx-auto">
      {/* Points des Factions */}
      <Card className="w-full p-6 rounded-2xl shadow-md bg-blue-50 border border-blue-200 space-y-4 mb-8">
        <h2 className="text-3xl font-bold text-blue-800 text-center">🏅 Points des Factions</h2>
        <div className="text-center text-gray-700">
          {factions.length > 0 ? (
            <div className="space-y-3">
              {factions.map((faction) => (
                <p key={faction.factionId} className="text-xl font-semibold">
                  {faction.name} : {factionPoints[faction.factionId] ?? 0} points
                </p>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Chargement des points...</p>
          )}
        </div>
      </Card>

      {/* Challenges disponibles */}
      <Card className="w-full p-6 rounded-2xl shadow-md space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center">🏆 Challenges disponibles</h2>

        {
        availableChallenges.length === 0 ? (
          <p className="text-gray-500 text-center">Aucun challenge disponible pour le moment.</p>
        ) : (
          <>
            {/* Filtres */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <label className="font-semibold mr-2">Filtrer par catégorie :</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1"
                >
                  {dynamicCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold mr-2">Trier par points :</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                  className="border border-gray-300 rounded px-3 py-1"
                >
                  <option value="asc">Croissant</option>
                  <option value="desc">Décroissant</option>
                </select>
              </div>
            </div>

            {/* Liste des challenges */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              {filteredAndSortedChallenges.map((challenge) => (
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
          </>
        )}
      </Card>
    </div>
  );
};
