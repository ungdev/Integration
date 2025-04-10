import { useEffect, useState } from "react";
import { getCurrentUser, updateCurrentUser } from "src/services/requests/user.service";
import { Input } from "../../styles/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../../styles/components/ui/card";
import { Button } from "../../styles/components/ui/button";
import { User } from "src/interfaces/user.interface";
import Select from "react-select";

const branchOptions = [
  { value: "TC", label: "Tronc Commun" },
  { value: "Branch", label: "Branche" },
  { value: "MM", label: "Mécanique et Matériaux" },
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
    const response = await updateCurrentUser({ branch : branch, contact : contact });
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
          <div>
            <label className="block text-sm font-medium">Contact</label>
            <Input value={contact} onChange={(e) => setContact(e.target.value)} />
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Enregistrement..." : "💾 Sauvegarder"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
