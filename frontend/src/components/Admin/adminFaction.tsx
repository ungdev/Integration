import { useEffect, useState } from "react";
import { Faction } from "../../interfaces/faction.interface";
import { createFaction, deleteFaction, getAllFactionsAdmin } from "../../services/requests/faction.service";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

export const AdminFactionManagement = () => {
    const [factions, setFactions] = useState<Faction[]>([]);
    const [newFactionName, setNewFactionName] = useState<string>("");

    useEffect(() => {
        fetchFactions();
    }, []);

    const fetchFactions = async () => {
        try {
            const factionList = await getAllFactionsAdmin();
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
            const response = await createFaction(newFactionName);
            alert(response.message);
            setNewFactionName("");
            fetchFactions();
        } catch (err) {
            console.error("Erreur lors de la création de la faction", err);
        }
    };

    const handleDeleteFaction = async (factionId: number) => {

        try {
            const response = await deleteFaction(factionId);
            alert(response.message);
            fetchFactions();
        } catch (err) {
            console.error("Erreur lors de la création de la faction", err);
        }
    };

    return (
        // <div className="flex flex-col items-center px-4 py-8 space-y-8 max-w-3xl mx-auto">
        <>
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                        🛡️ Créer une Faction
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
            </Card>

            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                        📜 Factions existantes
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                                    <Button
                                        onClick={() => handleDeleteFaction(faction.factionId)}
                                        className="bg-red-300 hover:bg-red-500 text-white text-xs px-2 py-1 rounded-md ml-2"
                                    >
                                        🗑️
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </>
        // </div >
    );
};
