import { Button } from "../../../components/ui/button";
import Swal from "sweetalert2";

import { openPermanence, closePermanence } from "../../../services/requests/permanence.service";
import { Permanence } from "../../../interfaces/permanence.interface";

interface PermanenceActionsProps {
  permanences: Permanence[];
  onRefresh: () => void;
}

// Fonction utilitaire pour "normaliser" une date au début de journée (00:00:00)
const normalizeDate = (d: Date): Date => {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const inSevenDays = (): Date => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return normalizeDate(d); // → seuil à J+7 mais à 00h00
};

const PermanenceActions: React.FC<PermanenceActionsProps> = ({ permanences, onRefresh }) => {
  const handleOpenAll = async (): Promise<void> => {
    const confirm = await Swal.fire({
      title: "Ouvrir toutes à J+7 ?",
      text: "Toutes les permanences commençant avant J+7 seront ouvertes.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ouvrir",
      cancelButtonText: "Annuler",
    });
    if (!confirm.isConfirmed) return;

    const today = normalizeDate(new Date()).getTime();
    const threshold = inSevenDays().getTime();

    const toOpen = permanences.filter((p) => {
      const permDate = normalizeDate(new Date(p.start_at)).getTime();
      return permDate > today && permDate <= threshold && !p.is_open;
  });

    try {
      await Promise.all(toOpen.map((p) => openPermanence(p.id)));
      await Swal.fire("Ouvertes", "Toutes les permanences ont été ouvertes !", "success");
      onRefresh();
    } catch {
      Swal.fire("Erreur", "Une erreur est survenue lors de l'ouverture", "error");
    }
  };

  const handleCloseAll = async (): Promise<void> => {
    const confirm = await Swal.fire({
      title: "Fermer toutes à J+7 ?",
      text: "Toutes les permanences commençant avant J+7 seront fermées.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Fermer",
      cancelButtonText: "Annuler",
    });
    if (!confirm.isConfirmed) return;

    const threshold = inSevenDays().getTime();
    const toClose = permanences.filter((p) => {
      const permDate = normalizeDate(new Date(p.start_at)).getTime();
      return permDate <= threshold;
    });
    try {
      await Promise.all(toClose.map((p) => closePermanence(p.id)));
      await Swal.fire("Fermées", "Toutes les permanences ont été fermées !", "success");
      onRefresh();
    } catch {
      Swal.fire("Erreur", "Une erreur est survenue lors de la fermeture", "error");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-center">
      <Button onClick={() => void handleOpenAll()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl">
        📅 Ouvrir toutes à J+7
      </Button>
      <Button onClick={() => void handleCloseAll()} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl">
        🛑 Fermer toutes à J+7
      </Button>
    </div>
  );
};

export default PermanenceActions;
