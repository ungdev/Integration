import { useState, useEffect } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import Select from "react-select";
import { getAllFactionsAdmin } from "../../../services/requests/faction.service";
import { Faction } from "../../../interfaces/faction.interface";
import Swal from "sweetalert2";
import { addPointsToFaction } from "../../../services/requests/challenge.service";


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
      } catch (error) {
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
    } catch (error) {
      Swal.fire("Erreur", "❌ Une erreur est survenue lors de l'ajout des points", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="card p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          🎯 Ajouter des points à une faction
        </h2>

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
      </div>
    </div>
  );
};
