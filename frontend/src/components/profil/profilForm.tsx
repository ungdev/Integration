import { useEffect, useState } from "react";
import { getCurrentUser, updateCurrentUser } from "../../services/requests/user.service";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { User } from "../../interfaces/user.interface";
import Select from "react-select";
import { FaDiscord } from "react-icons/fa";

const branchOptions = [
  { value: "TC", label: "Tronc Commun" },
  { value: "RT", label: "Réseaux et Télcommunications" },
  { value: "ISI", label: "Informatique et Systèmes d'Information" },
  { value: "GM", label: "Génie Mécanique" },
  { value: "GI", label: "Génie Industriel" },
  { value: "MTE", label: "Matériaux : Technologie et Economie" },
  { value: "A2I", label: "Automatique & Informatique Industrielle" },
  { value: "GI_APPR", label: "Génie Industriel en Apprentissage" },
  { value: "GM_APPR", label: "Génie Mécanique en Apprentissage" },
  { value: "SN_APPR", label: "Systeme Numérique en Apprentissage" },
  { value: "Branch", label: "Branche" },
  { value: "MM", label: "Mécanique et Matériaux" },
  { value: "Master", label: "Master" },
  { value: "RI", label: "Ressources International" },
];

export const ProfilForm = () => {
  const [user, setUser] = useState<User | null>(null);
  const [branch, setBranch] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const me = await getCurrentUser();
        setUser(me);
        setBranch(me.branch || "");
        setContact(me.contact || "");
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur", err);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const response = await updateCurrentUser({ branch: branch, contact: contact });
    alert(response.message);
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center px-4 py-10 space-y-10 max-w-5xl mx-auto">
      <Card className="w-full p-6 rounded-2xl shadow space-y-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">👤 Mon Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium">Prénom</label>
            <Input value={user.firstName} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium">Nom</label>
            <Input value={user.lastName} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <Input value={user.email} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium">Permission</label>
            <Input value={user.permission} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium">Filière</label>
            <Select
              value={branchOptions.find((b) => b.value === branch)}
              onChange={(selected) => {
                if (selected) {
                  setBranch(selected.value);
                } else {
                  setBranch("");
                }
              }}
              options={branchOptions}
              placeholder="Choisir une filière"
              isClearable
            />
          </div>
          <div className={`${user.contact === null || user.contact === "" ? "p-4 rounded-lg bg-yellow-100 border border-yellow-300" : ""}`}>
            {user.permission === "Student" || user.permission === "Admin" ? (
              <label className="block text-sm font-medium">Contact - <u>Comment tes nouveaux pourront te contacter !</u></label>
            ) : (
              <label className="block text-sm font-medium">Contact (visible uniquement pour les organisateurs)</label>
            )}
            <Input value={contact} onChange={(e) => setContact(e.target.value)} className={user.contact === null || user.contact === "" ? "bg-white" : ""} />
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Enregistrement..." : "💾 Sauvegarder"}
          </Button>
          <>
            {user.discord_id ? (
              <div className="w-full p-4 bg-green-100 text-green-800 rounded text-center">
                ✅ Ton compte Discord est bien lié !
              </div>
            ) : (
              <button
                onClick={() => {
                  window.location.href =
                    "https://discord.com/oauth2/authorize?client_id=1400196109434884189&response_type=code&redirect_uri=https%3A%2F%2Fintegration.utt.fr%2Fdiscord&scope=identify";
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2 text-white py-2 rounded"
              >
                <FaDiscord size={20} />
                Lier mon compte Discord
              </button>
            )}
          </>
        </CardContent>
      </Card>
    </div >
  );
};
