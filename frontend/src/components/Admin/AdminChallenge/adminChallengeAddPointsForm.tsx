import { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";

import { type Faction } from "../../../interfaces/faction.interface";
import { addPointsToFaction } from "../../../services/requests/challenge.service";
import { getAllFactionsAdmin } from "../../../services/requests/faction.service";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";

export const AdminChallengeAddPointsForm = () => {
    const [factions, setFactions] = useState<Faction[]>([]);
    const [title, setTitle] = useState("");
    const [factionId, setFactionId] = useState<number | null>(null);
    const [points, setPoints] = useState<number | string>("");
    const [reason, setReason] = useState("");

    useEffect(() => {
        const fetchFactions = async () => {
            try {
                const response = await getAllFactionsAdmin();
                setFactions(response);
            } catch {
                Swal.fire("Erreur", "Impossible de récupérer les factions", "error");
            }
        };
        fetchFactions();
    }, []);

    const handleSubmit = async () => {
        if (!title || !factionId || !points || !reason) {
            Swal.fire("Champs manquants", "Tous les champs doivent être remplis", "warning");
            return;
        }

        const pointsNumber = Number(points);
        if (isNaN(pointsNumber)) {
            Swal.fire("Erreur", "Veuillez entrer un nombre valide pour les points", "error");
            return;
        }

        try {
            const result = await addPointsToFaction({
                title,
                factionId,
                points: pointsNumber,
                reason,
            });

            Swal.fire({
                icon: "success",
                title: "Succès",
                text: result.message,
                timer: 1500,
                showConfirmButton: false,
            });

            setTitle("");
            setFactionId(null);
            setPoints("");
            setReason("");
        } catch {
            Swal.fire("Erreur", "❌ Une erreur est survenue lors de l'ajout des points", "error");
        }
    };

    return (
        <div>
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                        🎯 Ajouter des points à une faction
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">

                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre du challenge" />

                    <Select
                        value={
                            factionId
                                ? {
                                    value: factionId,
                                    label: factions.find((f) => f.factionId === factionId)?.name || "Faction non trouvée",
                                }
                                : null
                        }
                        onChange={(option) => setFactionId(option ? option.value : null)}
                        options={factions.map((f) => ({ value: f.factionId, label: f.name }))}
                        placeholder="Sélectionner une faction"
                    />

                    <Input type="number" value={points} onChange={(e) => setPoints(e.target.value)} placeholder="Nombre de points" />

                    <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Raison" />

                    <div className="flex justify-center pt-4">
                        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
                            Ajouter les points
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
