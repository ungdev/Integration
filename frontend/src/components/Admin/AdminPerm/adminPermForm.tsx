import { useState, useEffect } from "react";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import Swal from "sweetalert2";

import {
  createPermanence,
  updatePermanence,
} from "../../../services/requests/permanence.service";
import { Permanence } from "../../../interfaces/permanence.interface";

interface PermanenceFormProps {
  editMode: boolean;
  editPermanence: Permanence | null;
  onRefresh: () => void;
  onCancelEdit: () => void;
}


const PermanenceForm = ({ editMode, editPermanence, onRefresh, onCancelEdit } : PermanenceFormProps) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [difficulty, setDifficulty] = useState(0);

  useEffect(() => {
    if (editMode && editPermanence) {
      setName(editPermanence.name);
      setDesc(editPermanence.description);
      setLocation(editPermanence.location);
      setStartAt(editPermanence.start_at);
      setEndAt(editPermanence.end_at);
      setCapacity(editPermanence.capacity);
      setDifficulty(editPermanence.difficulty);
    }
  }, [editMode, editPermanence]);

  const handleSubmit = async () => {
    if (!name || !desc || !location || !startAt || !endAt || !capacity || !difficulty) {
      Swal.fire("Erreur", "Veuillez remplir tous les champs", "warning");
      return;
    }

    try {
      if (editMode && editPermanence) {
        await updatePermanence(editPermanence.id, {
          name,
          description: desc,
          location,
          start_at: startAt,
          end_at: endAt,
          capacity,
          difficulty,
        });
        Swal.fire("Succès", "Permanence mise à jour", "success");
        onCancelEdit();
      } else {
        await createPermanence({
          name,
          description: desc,
          location,
          start_at: startAt,
          end_at: endAt,
          capacity,
          difficulty
        });
        Swal.fire("Succès", "Permanence créée", "success");
      }

      resetForm();
      onRefresh();
    } catch {
      Swal.fire("Erreur", "Impossible de sauvegarder", "error");
    }
  };

  const resetForm = () => {
    setName("");
    setDesc("");
    setLocation("");
    setStartAt("");
    setEndAt("");
    setCapacity(0);
  };

  return (
    <Card className="w-full max-w-2xl p-6 shadow-lg rounded-2xl">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        {editMode ? "✏️ Éditer la permanence" : "➕ Créer une permanence"}
      </h2>
      <div className="flex flex-col gap-4">
        <Input placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
        <Textarea placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
        <Input placeholder="Lieu" value={location} onChange={(e) => setLocation(e.target.value)} />
        <Input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} />
        <Input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} />
        <Input type="number" placeholder="Capacité" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} />
        <Input type="number" placeholder="Difficulté" value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value))} />
        
        <div className="flex gap-2">
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white">
            {editMode ? "✅ Sauvegarder" : "Créer"}
          </Button>
          {editMode && (
            <Button variant="outline" onClick={onCancelEdit}>
              Annuler
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PermanenceForm;
