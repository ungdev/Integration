import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Select from "react-select";
import {
  assignRolesToUser,
  removeRoleFromUser,
  fetchAvailableRoles,
  fetchUsersByRole,
  fetchUserRoles,
} from "../../services/requests/role.service";
import { User } from "../../interfaces/user.interface";
import { Role } from "../../interfaces/role.interface";
import { getUsers } from "../../services/requests/user.service";

export const AdminRolePreferences = () => {
  const [selectedPreference, setSelectedPreference] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getRoles = async () => {
      try {
        const allRoles = await fetchAvailableRoles();
        setRoles(allRoles);
      } catch (error) {
        console.error("Erreur lors de la récupération des rôles :", error);
      }
    };
    getRoles();
  }, []);

  useEffect(() => {
    if (selectedPreference) {
      fetchUsersByPreference(selectedPreference);
    }
  }, [selectedPreference]);

  const fetchUsersByPreference = async (roleName: string) => {
    setLoading(true);
    try {
      const usersByPreference = await fetchUsersByRole(roleName);
      setUsers(usersByPreference);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = roles.map(role => ({
    value: role.name,
    label: role.name,
  }));

  return (
    <div className="flex justify-center items-center w-full">
      <Card className="p-6 shadow-xl rounded-lg bg-white w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Gestion des Préférences de Rôle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Sélectionner une préférence
            </label>
            <Select
              options={roleOptions}
              value={
                selectedPreference
                  ? { value: selectedPreference, label: selectedPreference }
                  : null
              }
              onChange={(option) => setSelectedPreference(option?.value || "")}
              placeholder="Choisir une préférence"
              className="w-full"
            />
          </div>

          {loading ? (
            <p className="text-center">Chargement...</p>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Utilisateurs ayant sélectionné "{selectedPreference}"
              </h3>
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
                        <td className="px-4 py-2">{user.email ?? "Pas d'email"}</td>
                        <td className="px-4 py-2">{user.contact ?? "Pas de contact"}</td>
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
  const [userRoles, setUserRoles] = useState<{ roleId: number; roleName: string }[]>([]);
  const [newRoles, setNewRoles] = useState<number[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const users = await getUsers();
        const allRoles = await fetchAvailableRoles();
        setUsers(users);
        setRoles(allRoles);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const getUserRoles = async () => {
      if (!selectedUser) {
        setUserRoles([]);
        return;
      }
      try {
        const rawUserRoles = await fetchUserRoles(selectedUser); // [{ roleId, roleName }]
        setUserRoles(rawUserRoles);
      } catch (error) {
        console.error("Erreur récupération rôles :", error);
      }
    };
    getUserRoles();
  }, [selectedUser]);

  const handleAddRoles = async () => {
    if (!selectedUser || newRoles.length === 0) return;
    try {
      await assignRolesToUser(selectedUser, newRoles);
      setMessage("Rôles ajoutés avec succès !");
      setSelectedUser(null); // Reset
      setNewRoles([]);
    } catch {
      setMessage("Erreur lors de l'ajout des rôles.");
    }
  };

  const handleRemoveRole = async (roleId: number) => {
    if (!selectedUser) return;
    try {
      await removeRoleFromUser(selectedUser, roleId);
      setMessage("Rôle supprimé avec succès !");
      setUserRoles(prev => prev.filter(r => r.roleId !== roleId));
    } catch {
      setMessage("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="flex justify-center w-full">
      <Card className="p-6 shadow-xl bg-white w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">Gestion des rôles</CardTitle>
        </CardHeader>
        <CardContent>
          {message && (
            <div className="mb-4 p-4 rounded bg-blue-100 text-center">
              {message}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Utilisateur</label>
            <Select
              options={users.map(user  => ({
                value: user.userId,
                label: `${user.firstName} ${user.lastName}`,
              }))}
              value={
                selectedUser
                  ? {
                      value: selectedUser,
                      label: users.find(u => u.userId === selectedUser)?.firstName +
                        " " +
                        users.find(u => u.userId === selectedUser)?.lastName,
                    }
                  : null
              }
              onChange={(option: any) => setSelectedUser(option?.value ?? null)}
              placeholder="Choisir un utilisateur"
              className="w-full"
            />
          </div>

          {selectedUser && (
            <>
              <h3 className="text-md font-semibold mb-2">Rôles actuels :</h3>
              <ul className="mb-4 space-y-2">
                {userRoles.length > 0 ? (
                  userRoles.map(role => (
                    <li key={role.roleId} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                      <span>{role.roleName}</span>
                      <button
                        className="text-sm text-red-600 hover:underline"
                        onClick={() => handleRemoveRole(role.roleId)}
                      >
                        Supprimer
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">Aucun rôle attribué</p>
                )}
              </ul>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Ajouter des rôles</label>
                <Select
                  isMulti
                  options={roles
                    .filter(r => !userRoles.some(ur => ur.roleId === r.roleId))
                    .map(role => ({
                      value: role.roleId,
                      label: role.name,
                    }))}
                  value={roles
                    .filter(r => newRoles.includes(r.roleId))
                    .map(role => ({
                      value: role.roleId,
                      label: role.name,
                    }))}
                  onChange={(selected: any) => {
                    setNewRoles(selected.map((s: any) => s.value));
                  }}
                  placeholder="Sélectionner des rôles à ajouter"
                  className="w-full"
                />
              </div>

              <button
                onClick={handleAddRoles}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Ajouter les rôles sélectionnés
              </button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};




