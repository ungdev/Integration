import { useEffect, useState } from "react";
import Select from "react-select";
import { Card, CardHeader, CardTitle, CardContent } from "../../styles/components/ui/card";
import { Input } from "../../styles/components/ui/input";
import { Button } from "../../styles/components/ui/button";
import {
  getUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
} from "src/services/requests/user.service";
import { User } from "src/interfaces/user.interface";

const permissionOptions = [
  { value: "Admin", label: "Admin" },
  { value: "Student", label: "Étudiant" },
  { value: "Nouveau", label: "Nouveau" },
];

const branchOptions = [
  { value: "TC", label: "Tronc Commun" },
  { value: "Branch", label: "Branche" },
  { value: "MM", label: "Mécanique et Matériaux" },
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
              <Button type="button" onClick={handleSave}>
                💾 Sauvegarder
              </Button>
              <Button type="button" onClick={handleDelete} variant="destructive">
                🗑 Supprimer
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
