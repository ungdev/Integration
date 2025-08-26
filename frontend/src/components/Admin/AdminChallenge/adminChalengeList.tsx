import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Challenge } from "../../../interfaces/challenge.interface";
import { deleteChallenge } from "../../../services/requests/challenge.service";
import Swal from "sweetalert2";
import { Trash2, Edit } from "lucide-react";

interface Props {
  challenges: Challenge[];
  refreshChallenges: () => void;
  onEdit: (c: Challenge) => void;
}

const AdminChallengeList = ({ challenges, refreshChallenges, onEdit }: Props) => {
  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Supprimer ?",
      text: "Cette action est irréversible",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (!confirm.isConfirmed) return;

    await deleteChallenge(id);
    Swal.fire({ icon: "success", title: "Challenge supprimé !" });
    refreshChallenges();
  };

  return (
    <Card className="p-6 rounded-2xl shadow-lg">
      <h3 className="text-2xl font-semibold text-center mb-6">📜 Challenges</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((c) => (
          <div
            key={c.id}
            className="bg-gray-100 p-4 rounded-xl border shadow flex flex-col justify-between"
          >
            <div>
              <h4 className="font-bold text-lg">{c.title}</h4>
              <p className="text-gray-700">{c.description}</p>
              <p className="text-sm text-gray-500 mt-1">Catégorie : {c.category}</p>
              <p className="text-sm text-gray-500">Points : {c.points}</p>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => onEdit(c)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2"
              >
                <Edit className="w-4 h-4" /> Modifier
              </Button>
              <Button
                onClick={() => handleDelete(c.id)}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AdminChallengeList;
