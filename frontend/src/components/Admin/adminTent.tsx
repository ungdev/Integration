import { useEffect, useState } from "react";
import { getAllTentPairs } from "../../services/requests/tent.service";
import Swal from "sweetalert2";
import { Button } from "../ui/button";

interface TentPair {
  user1_first_name: string;
  user1_last_name: string;
  user1_email: string;
  user2_first_name: string;
  user2_last_name: string;
  user2_email: string;
  confirmed: boolean;
}

export const TentAdmin = () => {
  const [pairs, setPairs] = useState<TentPair[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPairs = async () => {
    setLoading(true);
    try {
      const result = await getAllTentPairs();
      if (result?.data) {
        setPairs(result.data);
      }
    } catch {
      Swal.fire("Erreur", "Impossible de récupérer les binômes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPairs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="card p-6 rounded-2xl shadow space-y-4 bg-white">
        <h2 className="text-2xl font-bold text-gray-800 text-center">🛠️ Binômes de tentes</h2>

        <div className="flex justify-end">
          <Button
            onClick={fetchPairs}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? "Chargement..." : "Rafraîchir"}
          </Button>
        </div>

        {pairs.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">Aucun binôme enregistré.</p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full table-auto border rounded-xl">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  <th className="p-2 text-left">👤 Nom 1</th>
                  <th className="p-2 text-left">📧 Email 1</th>
                  <th className="p-2 text-left">👤 Nom 2</th>
                  <th className="p-2 text-left">📧 Email 2</th>
                  <th className="p-2 text-left">✅ Confirmée</th> {/* TODO: FAIRE LE BOUTON CONFIRMER + EMAIL DE CONFIRMATION */}
                </tr>
              </thead>
              <tbody>
                {pairs.map((pair, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="p-2">{pair.user1_first_name} {pair.user1_last_name}</td>
                    <td className="p-2">{pair.user1_email}</td>
                    <td className="p-2">{pair.user2_first_name} {pair.user2_last_name}</td>
                    <td className="p-2">{pair.user2_email}</td>
                    <td className="p-2">
                      {pair.confirmed ? (
                        <span className="text-green-600 font-semibold">Oui</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Non</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
