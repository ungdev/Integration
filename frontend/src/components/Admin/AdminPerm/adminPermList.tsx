import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import Swal from "sweetalert2";

import PermanenceMembers from "./adminPermMembers";
import {
  deletePermanence,
  openPermanence,
  closePermanence,
} from "../../../services/requests/permanence.service";

import { Permanence } from "../../../interfaces/permanence.interface";
import { User } from "../../../interfaces/user.interface";

interface PermanenceListProps {
  permanences: Permanence[];
  users: User[];
  onRefresh: () => void;
  onEdit: (perm: Permanence) => void;
}

const PermanenceList = ({ permanences, users, onRefresh, onEdit } : PermanenceListProps) => {
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        await deletePermanence(id);
        Swal.fire("Supprimée", "La permanence a été supprimée", "success");
        onRefresh();
      } catch {
        Swal.fire("Erreur", "Impossible de supprimer", "error");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {permanences.map((perm : Permanence) => (
        <Card key={perm.id} className="p-6 rounded-2xl shadow-md border hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-gray-900">{perm.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{perm.description}</p>

          <div className="text-gray-700 text-sm mt-4 space-y-1">
            <div><strong>📍 Lieu :</strong> {perm.location}</div>
            <div><strong>🕒 Début :</strong> {perm.start_at}</div>
            <div><strong>🕔 Fin :</strong> {perm.end_at}</div>
            <div><strong>👥 Capacité :</strong> {perm.capacity}</div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {perm.isOpen ? (
              <Button onClick={() => closePermanence(perm.id).then(onRefresh)} className="bg-orange-600 text-white">
                Fermer
              </Button>
            ) : (
              <Button onClick={() => openPermanence(perm.id).then(onRefresh)} className="bg-blue-600 text-white">
                Ouvrir
              </Button>
            )}
            <Button onClick={() => onEdit(perm)} className="bg-yellow-500 text-white">
              ✏️ Éditer
            </Button>
            <Button onClick={() => handleDelete(perm.id)} className="bg-red-600 text-white">
              🗑️ Supprimer
            </Button>
          </div>

          {/* Membres */}
          <PermanenceMembers perm={perm} users={users} onRefresh={onRefresh} />
        </Card>
      ))}
    </div>
  );
};

export default PermanenceList;
