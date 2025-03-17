import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../styles/components/ui/card"; // Composants UI
import { addRolesToUser, deleteRolesToUser, getRoles, getUsersByRoleHandler, getUsersWithRoles } from "src/services/requests/role.service";
import { User } from "src/interfaces/user.interface";
import { Role } from "src/interfaces/role.interface";
import { Button } from "../../styles/components/ui/button";
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
  const [selectedRole, setSelectedRole] = useState(""); // Rôle sélectionné
  const [users, setUsers] = useState<User[]>([]); // Liste des utilisateurs ayant sélectionné ce rôle
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedRole) {
      fetchUsersByRole(selectedRole); // Appeler la fonction pour récupérer les utilisateurs à chaque changement de rôle
    }
  }, [selectedRole]);

  // Fonction pour récupérer les utilisateurs par rôle
  const fetchUsersByRole = async (roleName: string) => {
    setLoading(true);
    try {
      const usersByRole = await getUsersByRoleHandler(roleName)
      setUsers(usersByRole); // Met à jour les utilisateurs dans le state
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs : ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full ">
      <Card className="p-6 shadow-xl rounded-lg bg-white w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">Gestion des Préférences de Rôle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Sélectionner un rôle</label>
            <select 
              className="w-full p-2 border rounded-lg"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Choisir un rôle</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="text-center">Chargement...</p>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4">Utilisateurs ayant sélectionné "{selectedRole}"</h3>
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
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">{user.contact}</td>
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
  // États pour stocker les données et les sélections
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]); // Sélectionner plusieurs rôles
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  // Charger les utilisateurs et les rôles
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Requête pour récupérer les utilisateurs et les rôles depuis le backend
        const users = await getUsers();
        setUsers(users);

        const roles = await getRoles();
        setRoles(roles);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Fonction pour ajouter plusieurs rôles à un utilisateur
  const handleAddRoles = async () => {
    if (!selectedUser || selectedRoles.length === 0) {
      setMessage("Veuillez sélectionner un utilisateur et un ou plusieurs rôles.");
      return;
    }

    try {
      await addRolesToUser(
        selectedUser,
        selectedRoles, // Envoi d'un tableau de rôle(s)
      );
      setMessage("Rôles ajoutés avec succès.");
      // Réinitialiser les sélections après succès
      setSelectedUser(null);
      setSelectedRoles([]);
    } catch (error) {
      console.error("Erreur lors de l'ajout des rôles", error);
      setMessage("Une erreur est survenue lors de l'ajout des rôles.");
    }
  };

  // Fonction pour supprimer plusieurs rôles d'un utilisateur
  const handleRemoveRoles = async () => {
    if (!selectedUser || selectedRoles.length === 0) {
      setMessage("Veuillez sélectionner un utilisateur et un ou plusieurs rôles à supprimer.");
      return;
    }

    try {
      await deleteRolesToUser(
        selectedUser,
        selectedRoles, // Envoi d'un tableau de rôle(s)
      );
      setMessage("Rôles supprimés avec succès.");
      // Réinitialiser les sélections après succès
      setSelectedUser(null);
      setSelectedRoles([]);
    } catch (error) {
      console.error("Erreur lors de la suppression des rôles", error);
      setMessage("Une erreur est survenue lors de la suppression des rôles.");
    }
  };

  return (
    <div className="flex justify-center items-center w-full ">
    <Card className="p-6 shadow-xl rounded-lg bg-white w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">Gestion des Rôle des utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>

        {/* Message d'information */}
        {message && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              message.includes("succès") ? "bg-green-200" : "bg-red-200"
            }`}
          >
            <p className="text-center">{message}</p>
          </div>
        )}

        {/* Sélecteur d'utilisateur */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Sélectionner un utilisateur</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={selectedUser ?? ""}
            onChange={(e) => setSelectedUser(Number(e.target.value))}
          >
            <option value="">Sélectionner un utilisateur</option>
            {users.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Sélecteur de rôles (plusieurs rôles sélectionnables) */}
        <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Sélectionner un ou plusieurs rôles</label>
        <select
          multiple
          className="w-full p-2 border rounded-lg"
          value={selectedRoles.map(String)} // Convertir les éléments en string
          onChange={(e) => {
            // Convertir les valeurs sélectionnées en number (en utilisant `Number()` pour chaque valeur)
            const options = Array.from(e.target.selectedOptions, (option) => Number(option.value));
            setSelectedRoles(options); // Mettre à jour l'état avec les rôles sélectionnés
          }}
        >
          {roles.map((role) => (
            <option key={role.roleId} value={role.roleId}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

        {/* Espacement entre le bouton ajouter et supprimer */}
        <div className="mt-4">
          <button
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            onClick={handleAddRoles}
          >
            Ajouter un rôle
          </button>
        </div>

        {/* Ajouter un espacement ici pour le bouton Supprimer */}
        <div className="mt-4">
          <button
            className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
            onClick={handleRemoveRoles}
          >
            Supprimer un rôle
          </button>
        </div>


        {/* Affichage du message de chargement */}
        {loading && (
          <div className="mt-4 text-center text-gray-500">Chargement...</div>
        )}

      </CardContent>
    </Card>
  </div>
  );
};
