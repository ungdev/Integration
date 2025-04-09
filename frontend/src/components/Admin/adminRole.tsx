import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../styles/components/ui/card"; // Composants UI
import Select from "react-select"; // Importer react-select
import { addRolesToUser, deleteRolesToUser, getRoles, getUsersByRoleHandler, getUsersRoles } from "src/services/requests/role.service";
import { User } from "src/interfaces/user.interface";
import { Role } from "src/interfaces/role.interface";
import { getUsers } from "src/services/requests/user.service";

// Liste des rôles disponibles
const roles = [
  "Animation", "Bouffe", "Cahier de vacances", "Communication & Graphisme", 
  "Dev / Info", "Déco", "Défis TC", "Faux amphi", "Faux discours de rentrée", 
  "Logistique", "Médiatik", "Parrainage", "Partenariat", "Prévention", 
  "Rallye", "Respo CE", "Son et lumière", "Soutenabilité", 
  "Traduction en anglais", "Village Asso", "Visites", "WEI"
];

export const AdminRolePreferences = () => {
  const [selectedPreference, setSelectedPreference] = useState(""); // Rôle sélectionné
  const [users, setUsers] = useState<User[]>([]); // Liste des utilisateurs ayant sélectionné ce rôle
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPreference) {
      fetchUsersByPreference(selectedPreference); // Appeler la fonction pour récupérer les utilisateurs à chaque changement de rôle
    }
  }, [selectedPreference]);

  // Fonction pour récupérer les utilisateurs par rôle
  const fetchUsersByPreference = async (roleName: string) => {
    setLoading(true);
    try {
      const usersByPreference = await getUsersByRoleHandler(roleName);
      setUsers(usersByPreference); // Met à jour les utilisateurs dans le state
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs : ", error);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = roles.map(role => ({ value: role, label: role }));

  return (
    <div className="flex justify-center items-center w-full ">
      <Card className="p-6 shadow-xl rounded-lg bg-white w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">Gestion des Préférences de Rôle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Sélectionner une préférence</label>
            <Select
              options={roleOptions}
              value={selectedPreference ? { value: selectedPreference, label: selectedPreference } : null}
              onChange={(selectedOption: any) => setSelectedPreference(selectedOption?.value || "")}
              placeholder="Choisir une préférence"
              className="w-full"
            />
          </div>

          {loading ? (
            <p className="text-center">Chargement...</p>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4">Utilisateurs ayant sélectionné "{selectedPreference}"</h3>
              {users.length > 0 ? (
                <table className="min-w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Prénom</th>
                      <th className="px-4 py-2 text-left">Nom</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.userId}>
                        <td className="px-4 py-2">{user.firstName}</td>
                        <td className="px-4 py-2">{user.lastName}</td>
                        <td className="px-4 py-2">{user.email ?? "Pas d'email enregitré"}</td>
                        <td className="px-4 py-2">{user.contact ?? "Pas de contact enregitré"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Aucun utilisateur n'a sélectionné ce rôle.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


export const AdminRoleManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const users = await getUsers();
        setUsers(users);
        const roles = await getRoles();
        setRoles(roles);
      } catch (error) {
        console.error("Erreur initiale", error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        if (selectedUser) {
          const usersRoles = await getUsersRoles(selectedUser);
          const roleIds = usersRoles.map((role: { roleId: number }) => role.roleId);
          setSelectedRoles(roleIds);
        } else {
          setSelectedRoles([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des rôles utilisateur", error);
      }
    };

    fetchUserRoles();
  }, [selectedUser]);

  const handleAddRoles = async () => {
    if (!selectedUser || selectedRoles.length === 0) {
      setMessage("Veuillez sélectionner un utilisateur et un ou plusieurs rôles.");
      return;
    }

    try {
      const response = await addRolesToUser(selectedUser, selectedRoles);
      setMessage(response.message);
      setSelectedUser(null);
      setSelectedRoles([]);
    } catch (error) {
      console.error("Erreur lors de l'ajout des rôles", error);
      setMessage("Une erreur est survenue lors de l'ajout des rôles.");
    }
  };

  const handleRemoveRoles = async () => {
    if (!selectedUser || selectedRoles.length === 0) {
      setMessage("Veuillez sélectionner un utilisateur et un ou plusieurs rôles à supprimer.");
      return;
    }

    try {
      const response = await deleteRolesToUser(selectedUser, selectedRoles);
      setMessage(response.message);
      setSelectedUser(null);
      setSelectedRoles([]);
    } catch (error) {
      console.error("Erreur lors de la suppression des rôles", error);
      setMessage("Une erreur est survenue lors de la suppression des rôles.");
    }
  };

  const userOptions = users.map((user) => ({
    value: user.userId,
    label: `${user.firstName} ${user.lastName}`,
  }));

  const roleOptions = roles.map((role) => ({
    value: role.roleId,
    label: role.name,
  }));

  return (
    <div className="flex justify-center items-center w-full ">
      <Card className="p-6 shadow-xl rounded-lg bg-white w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">Gestion des Rôles des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>

          {message && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                message.includes("succès") ? "bg-green-200" : "bg-red-200"
              }`}
            >
              <p className="text-center">{message}</p>
            </div>
          )}

          {/* Sélectionner un utilisateur */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Sélectionner un utilisateur</label>
            <Select
              options={userOptions}
              value={selectedUser ? { value: selectedUser, label: userOptions.find(u => u.value === selectedUser)?.label } : null}
              onChange={(selectedOption: any) => setSelectedUser(selectedOption?.value ?? null)}
              placeholder="Sélectionner un utilisateur"
              className="w-full"
            />
          </div>

          {/* Sélectionner des rôles */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Sélectionner un ou plusieurs rôles</label>
            <Select
              isMulti
              options={roleOptions}
              value={roleOptions.filter(option => selectedRoles.includes(option.value))}
              onChange={(selectedOptions: any) =>
                setSelectedRoles(selectedOptions.map((option: any) => option.value))
              }
              placeholder="Sélectionner des rôles"
              className="w-full"
            />
          </div>

          <div className="mt-4">
            <button
              className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
              onClick={handleAddRoles}
            >
              Ajouter des rôles
            </button>
          </div>

          <div className="mt-4">
            <button
              className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
              onClick={handleRemoveRoles}
            >
              Supprimer des rôles
            </button>
          </div>

          {loading && (
            <div className="mt-4 text-center text-gray-500">Chargement...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
