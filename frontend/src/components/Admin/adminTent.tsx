import { useEffect, useState } from "react";
import { getAllTentPairs, toggleTentConfirmation } from "../../services/requests/tent.service";
import Swal from "sweetalert2";
import { Button } from "../ui/button";
import { Check, X, Search } from "lucide-react";

interface TentPair {
  user1_id: number;
  user1_first_name: string;
  user1_last_name: string;
  user1_email: string;
  user2_id: number;
  user2_first_name: string;
  user2_last_name: string;
  user2_email: string;
  confirmed: boolean;
}

export const TentAdmin = () => {
  const [pairs, setPairs] = useState<TentPair[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<"all" | "confirmed" | "unconfirmed">("all");

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

  const handleToggle = async (pair: TentPair) => {
    const action = pair.confirmed ? "dévalider" : "valider";

    const confirm = await Swal.fire({
      title: '⚠️ Confirmation requise',
      html: `
        <p>Souhaitez-vous vraiment <strong>${action}</strong> la tente de :</p>
        <ul style="list-style:none; padding-left:0;">
          <li><strong>${pair.user1_first_name} ${pair.user1_last_name}</strong></li>
          <li><strong>${pair.user2_first_name} ${pair.user2_last_name}</strong></li>
        </ul>
        <p style="color:red; font-weight:bold;">
          ⚠️ Cette action enverra un email au binôme concerné.
        </p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: pair.confirmed ? '#d33' : '#28a745',
      cancelButtonColor: '#3085d6',
      confirmButtonText: `✅ Oui, ${action}`,
      cancelButtonText: '❌ Annuler',
      reverseButtons: true,
      focusCancel: true,
    });


    if (!confirm.isConfirmed) return;

    try {
      await toggleTentConfirmation(pair.user1_id, pair.user2_id, !pair.confirmed);

      Swal.fire(
        "Succès ✅",
        `La tente a bien été ${pair.confirmed ? "dévalidée" : "validée"}.`,
        "success"
      );

      fetchPairs();
    } catch {
      Swal.fire("Erreur", "Impossible de mettre à jour la confirmation", "error");
    }
  };

  useEffect(() => {
    fetchPairs();
  }, []);

  // Filtrage par recherche + état
  const filteredPairs = pairs.filter((pair) => {
    const query = search.toLowerCase();
    const matchesSearch =
      pair.user1_first_name.toLowerCase().includes(query) ||
      pair.user1_last_name.toLowerCase().includes(query) ||
      pair.user1_email.toLowerCase().includes(query) ||
      pair.user2_first_name.toLowerCase().includes(query) ||
      pair.user2_last_name.toLowerCase().includes(query) ||
      pair.user2_email.toLowerCase().includes(query);

    const matchesFilter =
      filter === "all" ||
      (filter === "confirmed" && pair.confirmed) ||
      (filter === "unconfirmed" && !pair.confirmed);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🛠️ Gestion des binômes de tentes
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          {/* 🔎 Barre de recherche */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 transition"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>

          {/* 🔽 Filtre état */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "confirmed" | "unconfirmed")}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="all">📋 Tous</option>
            <option value="confirmed">✅ Validés</option>
            <option value="unconfirmed">❌ Non validés</option>
          </select>

          <Button
            onClick={fetchPairs}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto"
            disabled={loading}
          >
            {loading ? "Chargement..." : "🔄 Rafraîchir"}
          </Button>
        </div>

        {filteredPairs.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">Aucun binôme trouvé.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-xl shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">👤 Nom 1</th>
                  <th className="p-3 text-left">📧 Email 1</th>
                  <th className="p-3 text-left">👤 Nom 2</th>
                  <th className="p-3 text-left">📧 Email 2</th>
                  <th className="p-3 text-center">✅ État</th>
                  <th className="p-3 text-center">⚡ Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPairs.map((pair, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50 transition">
                    <td className="p-3">{pair.user1_first_name} {pair.user1_last_name}</td>
                    <td className="p-3">{pair.user1_email}</td>
                    <td className="p-3">{pair.user2_first_name} {pair.user2_last_name}</td>
                    <td className="p-3">{pair.user2_email}</td>
                    <td className="p-3 text-center">
                      {pair.confirmed ? (
                        <span className="flex items-center justify-center text-green-600 font-semibold">
                          <Check className="w-5 h-5 mr-1" /> Validée
                        </span>
                      ) : (
                        <span className="flex items-center justify-center text-red-600 font-semibold">
                          <X className="w-5 h-5 mr-1" /> Non validée
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <Button
                        onClick={() => handleToggle(pair)}
                        className={
                          pair.confirmed
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }
                      >
                        {pair.confirmed ? "❌ Dévalider" : "✅ Valider"}
                      </Button>
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
