import { useEffect, useState } from "react";
import Select from "react-select";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  getUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
  syncnewStudent,
} from "../../services/requests/user.service";
import { User } from "../../interfaces/user.interface";

const permissionOptions = [
  { value: "Admin", label: "Admin" },
  { value: "Student", label: "Étudiant" },
  { value: "Nouveau", label: "Nouveau" },
];

const branchOptions = [
  { value: "TC", label: "Tronc Commun" },
  { value: "Branch", label: "Branche" },
  { value: "MM", label: "Mécanique et Matériaux" },
  { valeu : "Master", label: "Master"},
  { value: "RI", label: "Ressources International" },
];

const majeurOptions = [
    { value: true, label: "Majeur" },
    { value: false, label: "Mineur" },
  ];

export const AdminUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsers();
      setUsers(res);
    };
    fetchUsers();
  }, []);

  const handleUserSelect = (option: any) => {
    const user = users.find((u) => u.userId === option.value);
    if (user) {
      setSelectedUser(user);
      setFormData({ ...user });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePermissionChange = (option: any) => {
    setFormData((prev) => ({ ...prev, permission: option?.value || null }));
  };

  const handleMajeurChange = (option: any) => {
    setFormData((prev) => ({ ...prev, mejeur: option?.value || null }));
  };

  const handleBranchChange = (option: any) => {
    setFormData((prev) => ({ ...prev, branch: option?.value || null }));
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    const response = await updateUserByAdmin(selectedUser.userId, formData);
    alert(response.message);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    const confirmDelete = confirm(
      `Supprimer ${selectedUser.firstName} ${selectedUser.lastName} ?`
    );
    if (confirmDelete) {
      const response = await deleteUserByAdmin(selectedUser.userId);
      setUsers((prev) => prev.filter((u) => u.userId !== selectedUser.userId));
      setSelectedUser(null);
      setFormData({});
      alert(response.message);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">👤 Gérer un utilisateur</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Select
          placeholder="Sélectionner un utilisateur"
          options={users.map((u) => ({
            value: u.userId,
            label: `${u.firstName} ${u.lastName} (${u.email})`,
          }))}
          onChange={handleUserSelect}
        />

        {selectedUser && (
          <form className="space-y-3 mt-4">
            <Input
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleInputChange}
              placeholder="Prénom"
            />
            <Input
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleInputChange}
              placeholder="Nom"
            />
            <Input
              name="email"
              value={formData.email || ""}
              disabled
              placeholder="Email"
            />
            <p className="text-s text-red-500 underline mt-4" ><strong>Attention : la donnée récupérée est à partir du 01/09/2025</strong></p>
            <Select
              placeholder="Majeur?"
              options={majeurOptions}
              value={
                formData.permission
                  ? majeurOptions.find((opt) => opt.value === formData.majeur)
                  : null
              }
              onChange={handleMajeurChange}
              isClearable
            />

            <Select
              value={branchOptions.find((b) => b.value === formData.branch)}
              onChange={handleBranchChange}
              options={branchOptions}
              placeholder="Choisir une filière"
              isClearable
            />

            <Input
              name="contact"
              value={formData.contact || ""}
              onChange={handleInputChange}
              placeholder="Contact"
            />

            <Select
              placeholder="Permission"
              options={permissionOptions}
              value={
                formData.permission
                  ? permissionOptions.find((opt) => opt.value === formData.permission)
                  : null
              }
              onChange={handlePermissionChange}
              isClearable
            />

            <div className="flex gap-4 mt-4">
              <Button type="button" onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                💾 Sauvegarder
              </Button>
              <Button type="button" onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">
                🗑 Supprimer
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};


export const AdminSyncNewStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handleSync = async () => {
    setLoading(true);
    setError(null);
    setMessage("");

    try {

      // Conversion directe de la date : '2025-09-01' → '2025.0901'
      let formattedDate = "";
      if (selectedDate) {
        const [year, month, day] = selectedDate.split("-");
        formattedDate = `${year}.${month}${day}`;
      }

      // Appel au backend avec la date sélectionnée
      const response = await syncnewStudent(formattedDate);
      setMessage(response.message);
    } catch (error) {
      console.error("Erreur de connexion à Google", error);
      setError("Erreur lors de la tentative de connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Synchro API SIEP
      </h2>

      <div className="mb-4">
        <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
          Choisir une date de vérification de majorité :
        </label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleSync}
          disabled={loading || !selectedDate}
          className="bg-blue-500 text-white hover:bg-blue-600 p-3 rounded-md"
        >
          {loading ? "Chargement..." : "Synchro SIEP"}
        </Button>
      </div>

      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
      {message && <div className="text-green-500 text-center mt-4">{message}</div>}
    </div>
  );
};

