import { useState, useEffect } from "react";
import { createTent, getUserTent, cancelTent } from "../../services/requests/tent.service";
import { getUsers } from "../../services/requests/user.service";
import { Button } from "../ui/button";
import Swal from "sweetalert2";
import { User } from "../../interfaces/user.interface";
import { decodeToken, getToken } from "../../services/requests/auth.service";
import { Tent } from "../../interfaces/tent.interface";

export const TentPublic = () => {

  const [userId2, setUserId2] = useState<number>();
  const [tentInfo, setTentInfo] = useState<Tent | null>(null);
  const [users, setUsers] = useState<User[]>([]);


  useEffect(() => {
    // Charger tous les users
    const fetchUsers = async () => {
      try {
        const result = await getUsers();
        setUsers(result);
      } catch {
        Swal.fire("Erreur", "Impossible de charger les utilisateurs", "error");
      }
    };

    // Charger la tente de l’utilisateur connecté
    const fetchTent = async () => {
    try {
      const result = await getUserTent();
      if (result?.data && result.data.length > 0) {
        setTentInfo(result.data[0]); // ✅ prendre data[0]
      }
    } catch {
      Swal.fire("Erreur", "Impossible de récupérer la tente", "error");
    }
  };

    fetchUsers();
    fetchTent();
  }, []);

    const token = getToken();
    if (!token) return null;
    const { userId } = decodeToken(token);

  const handleCreate = async () => {
    if (!userId2) {
      return Swal.fire("Erreur", "Sélectionne ton binôme", "error");
    }

    try {
      await createTent(userId2);
      Swal.fire("Succès", "Tente créée avec succès !", "success");
      handleGetTent(); // recharge les infos
    } catch (err: any) {
      Swal.fire("Erreur", err.message || "Impossible de créer la tente", "error");
    }
  };

  const handleCancel = async () => {
    try {
      await cancelTent();
      setTentInfo(null);
      setUserId2(undefined);
      Swal.fire("Annulée", "La tente a été annulée", "success");
    } catch {
      Swal.fire("Erreur", "Impossible d'annuler la tente", "error");
    }
  };

  const handleGetTent = async () => {
  try {
    const result = await getUserTent();
    if (result?.data && result.data.length > 0) {
      setTentInfo(result.data[0]);
    }
  } catch {
    Swal.fire("Erreur", "Impossible de récupérer la tente", "error");
  }
};

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="card p-6 rounded-2xl shadow space-y-4 bg-white">
        <h2 className="text-2xl font-bold text-gray-800 text-center">🏕️ Réserve ta tente</h2>

        {/* Si l’utilisateur n’a pas encore de tente → afficher formulaire */}
        {!tentInfo ? (
          <>
            <div className="grid grid-cols-1 gap-4">
              <select
                value={userId2 ?? ""}
                onChange={(e) => setUserId2(Number(e.target.value))}
                className="border p-2 rounded"
              >
                <option value="">Sélectionne ton binôme</option>
                {users
                  .filter((user : User) => user.userId !== userId) // exclure soi-même
                  .map((user : User) => (
                    <option key={user.userId} value={user.userId}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleCreate}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={!userId2}
              >
                Créer
              </Button>
            </div>
          </>
        ) : (
          // Sinon → afficher infos sur la tente
          <div className="mt-6 bg-gray-100 p-4 rounded">
            <h3 className="font-semibold text-lg mb-2">🎫 Ta tente :</h3>
            <p>
            Binôme avec{" "}
            <span className="font-bold">
                {users.find(user => user.userId === (tentInfo.user_id_1 === userId ? tentInfo.user_id_2 : tentInfo.user_id_1))?.firstName}{" "}
                {users.find(user => user.userId === (tentInfo.user_id_1 === userId ? tentInfo.user_id_2 : tentInfo.user_id_1))?.lastName}
            </span>
            </p>
            <div className="flex space-x-4 mt-4">
            <Button onClick={handleCancel} className="bg-red-600 hover:bg-red-700 text-white">
                Annuler
            </Button>
            </div>
        </div>
        )}
      </div>
    </div>
  );
};
