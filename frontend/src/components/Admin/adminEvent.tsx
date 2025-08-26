import { useState, useEffect } from "react";
import {
  toggleShotgun,
  togglePreRegistration,
  checkShotgunStatus,
  checkPreRegisterStatus,
  checkSDIStatus,
  checkWEIStatus,
  toggleSDI,
  toggleWEI,
  checkFoodStatus,
  toggleFood,
  toggleChallenge,
  checkChallengeStatus,
} from "../../services/requests/event.service";
import { Button } from "../ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Swal from "sweetalert2";

export const AdminEvents = () => {
  const [loading, setLoading] = useState(false);
  const [loadingStatuses, setLoadingStatuses] = useState(true);

  const [statuses, setStatuses] = useState({
    preRegistration: false,
    shotgun: false,
    sdi: false,
    wei: false,
    food: false,
    chall : false,
  });

  // Charger les statuts au montage
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const [preReg, shot, sdi, wei, food, chall] = await Promise.all([
          checkPreRegisterStatus(),
          checkShotgunStatus(),
          checkSDIStatus(),
          checkWEIStatus(),
          checkFoodStatus(),
          checkChallengeStatus()
        ]);

        setStatuses({
          preRegistration: preReg,
          shotgun: shot,
          sdi,
          wei,
          food,
          chall,
        });
      } catch {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Impossible de récupérer les statuts.",
        });
      } finally {
        setLoadingStatuses(false);
      }
    };
    fetchStatuses();
  }, []);

  // Fonction générique pour toggle un événement
  const handleToggle = async (
    key: keyof typeof statuses,
    toggleFn: (value: boolean) => Promise<any>,
    successMsg: string
  ) => {
    setLoading(true);
    try {
      await toggleFn(!statuses[key]);
      setStatuses((prev) => ({ ...prev, [key]: !prev[key] }));
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: successMsg,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error.response?.data?.message || "Une erreur est survenue",
      });
    } finally {
      setLoading(false);
    }
  };

  // Configuration des événements
  const events = [
    {
      key: "preRegistration" as const,
      label: "Pré-inscription",
      toggleFn: togglePreRegistration,
    },
    {
      key: "shotgun" as const,
      label: "Shotgun",
      toggleFn: toggleShotgun,
    },
    {
      key: "sdi" as const,
      label: "SDI (Billetterie)",
      toggleFn: toggleSDI,
    },
    {
      key: "wei" as const,
      label: "WEI (Billetterie + Tentes)",
      toggleFn: toggleWEI,
    },
    {
      key: "food" as const,
      label: "Nourriture (Billetterie)",
      toggleFn: toggleFood,
    },
    {
      key: "chall" as const,
      label: "Challenges (Affichage des challenges)",
      toggleFn: toggleChallenge,
    },
  ];

  if (loadingStatuses) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Loader2 className="animate-spin text-gray-600 w-8 h-8 mr-2" />
        <span className="text-xl font-semibold text-gray-600">
          Chargement des statuts...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        ⚙️ Gestion des Événements
      </h2>

      <div className="space-y-4">
        {events.map(({ key, label, toggleFn }) => {
          const isActive = statuses[key];
          return (
            <div
              key={key}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200"
            >
              <div className="flex items-center gap-2 text-gray-700">
                {isActive ? (
                  <CheckCircle className="text-green-600 w-5 h-5" />
                ) : (
                  <XCircle className="text-red-600 w-5 h-5" />
                )}
                <span className="font-medium">{label}</span>
              </div>

              <Button
                onClick={() =>
                  handleToggle(key, toggleFn, `${label} mis à jour !`)
                }
                disabled={loading}
                className={`transition-colors duration-300 ${
                  isActive
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } p-2 rounded-lg min-w-[110px] flex items-center justify-center`}
              >
                {loading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : isActive ? (
                  "Désactiver"
                ) : (
                  "Activer"
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
