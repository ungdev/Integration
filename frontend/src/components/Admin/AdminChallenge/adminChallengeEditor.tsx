import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Card } from "../../ui/card";
import Select from "react-select";
import { createChallenge, updateChallenge } from "../../../services/requests/challenge.service";
import { Challenge } from "../../../interfaces/challenge.interface";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

interface Props {
  editingChallenge: Challenge | null;
  setEditingChallenge: (c: Challenge | null) => void;
  refreshChallenges: () => void;
}

const categoryOptions = [
  { value: "Team", label: "Team" },
  { value: "Faction", label: "Faction" },
  { value: "User", label: "User" },
  { value: "Autre", label: "Autre" },
];

const ChallengeEditor = ({ editingChallenge, setEditingChallenge, refreshChallenges }: Props) => {
  const [form, setForm] = useState({ title: "", description: "", category: "", points: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingChallenge) {
      setForm({
        title: editingChallenge.title,
        description: editingChallenge.description,
        category: editingChallenge.category,
        points: editingChallenge.points,
      });
    }
  }, [editingChallenge]);

  const resetForm = () => {
    setForm({ title: "", description: "", category: "", points: 0 });
    setEditingChallenge(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editingChallenge) {
        await updateChallenge({ id: editingChallenge.id, ...form });
        Swal.fire({ icon: "success", title: "Challenge mis à jour !" });
      } else {
        await createChallenge(form);
        Swal.fire({ icon: "success", title: "Challenge créé !" });
      }
      refreshChallenges();
      resetForm();
    } catch {
      Swal.fire({ icon: "error", title: "Erreur lors de l'enregistrement" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 rounded-2xl shadow-lg space-y-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-center">
        {editingChallenge ? "✏️ Modifier Challenge" : "🛠️ Créer Challenge"}
      </h2>

      <Input
        placeholder="Titre"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <Input
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <Select
        placeholder="Catégorie"
        options={categoryOptions}
        value={categoryOptions.find((opt) => opt.value === form.category)}
        onChange={(opt) => setForm({ ...form, category: opt?.value || "" })}
      />
      <Input
        placeholder="Points"
        type="number"
        value={form.points}
        onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
      />

      <div className="flex gap-4">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Enregistrer"}
        </Button>
        {editingChallenge && (
          <Button onClick={resetForm} className="bg-gray-400 hover:bg-gray-500 text-white">
            Annuler
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ChallengeEditor;
