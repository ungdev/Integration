import { useEffect, useState } from "react";
import { Button } from "../../styles/components/ui/button";
import { Input } from "../../styles/components/ui/input";
import { Card } from "../../styles/components/ui/card";
import { getAllFactions, createFaction } from "src/services/requests/faction.service";
import { Faction } from "src/interfaces/faction.interface";

export const AdminFactionManagement = () => {
  const [factions, setFactions] = useState<Faction[]>([]);
  const [newFactionName, setNewFactionName] = useState<string>("");

  useEffect(() => {
    fetchFactions();
  }, []);

  const fetchFactions = async () => {
    try {
      const factionList = await getAllFactions();
      setFactions(factionList);
    } catch (err) {
      console.error("Erreur lors du chargement des factions", err);
    }
  };

  const handleCreateFaction = async () => {
    if (!newFactionName.trim()) {
      alert("Veuillez renseigner un nom pour la faction.");
      return;
    }

    if (factions.find((f) => f.name.toLowerCase() === newFactionName.trim().toLowerCase())) {
      alert("Une faction avec ce nom existe déjà.");
      return;
    }

    try {
      await createFaction(newFactionName);
      alert("✅ Faction créée !");
      setNewFactionName("");
      fetchFactions();
    } catch (err) {
      console.error("Erreur lors de la création de la faction", err);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-8 space-y-8 max-w-3xl mx-auto">
      <Card className="w-full p-6 rounded-2xl shadow-md space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center">🛡️ Gestion des Factions</h2>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <Input
            placeholder="Nom de la faction"
            value={newFactionName}
            onChange={(e) => setNewFactionName(e.target.value)}
            className="w-full md:w-64"
          />
          <Button onClick={handleCreateFaction} className="bg-green-600 hover:bg-green-700 text-white">
            ➕ Créer
          </Button>
        </div>
      </Card>

      <Card className="w-full p-6 rounded-2xl shadow-md">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">📜 Factions existantes</h3>
        {factions.length === 0 ? (
          <p className="text-gray-500 text-center">Aucune faction pour le moment.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-center">
            {factions.map((faction) => (
              <li
                key={faction.factionId}
                className="bg-gray-100 py-2 px-4 rounded-xl border border-gray-300 shadow-sm hover:bg-gray-200 transition"
              >
                {faction.name}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};
