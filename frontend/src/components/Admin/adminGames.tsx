import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Select from "react-select";
import {
  fetchAvailableRoles,
  fetchRolePointsById,
  addPointsToRole,
  removePointsFromRole,
} from "../../services/requests/role.service";
import { Role } from "../../interfaces/role.interface";

export const AdminRolePointsManager = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [currentPoints, setCurrentPoints] = useState<number | null>(null);
  const [pointsToAdd, setPointsToAdd] = useState<number>(0);
  const [pointsToRemove, setPointsToRemove] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const allRoles = await fetchAvailableRoles();
        setRoles(allRoles);
      } catch (error) {
        console.error("Erreur lors du chargement des rôles :", error);
      }
    };
    loadRoles();
  }, []);

  useEffect(() => {
    const loadPoints = async () => {
      if (!selectedRoleId) {
        setCurrentPoints(null);
        return;
      }
      try {
        const response = await fetchRolePointsById(selectedRoleId);
        setCurrentPoints(response.points);
      } catch (error) {
        console.error("Erreur lors de la récupération des points :", error);
      }
    };
    loadPoints();
  }, [selectedRoleId]);

  const handleAddPoints = async () => {
    if (!selectedRoleId || pointsToAdd <= 0) return;
    try {
      await addPointsToRole(selectedRoleId, pointsToAdd);
      setMessage("Points ajoutés avec succès !");
      setPointsToAdd(0);
      const response = await fetchRolePointsById(selectedRoleId);
      setCurrentPoints(response.updatedPoints);
    } catch {
      setMessage("Erreur lors de l'ajout des points.");
    }
  };

  const handleRemovePoints = async () => {
    if (!selectedRoleId || pointsToRemove <= 0) return;
    try {
      await removePointsFromRole(selectedRoleId, pointsToRemove);
      setMessage("Points retirés avec succès !");
      setPointsToRemove(0);
      const response = await fetchRolePointsById(selectedRoleId);
      setCurrentPoints(response.updatedPoints);
    } catch {
      setMessage("Erreur lors du retrait des points.");
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
          Gestion des Points par Rôle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <div className="mb-4 p-4 rounded bg-blue-100 text-center">
            {message}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Sélectionner un rôle</label>
          <Select
            options={roles.map(role => ({
              value: role.roleId,
              label: role.name,
            }))}
            value={
              selectedRoleId
                ? {
                  value: selectedRoleId,
                  label: roles.find(r => r.roleId === selectedRoleId)?.name,
                }
                : null
            }
            onChange={(option: any) => setSelectedRoleId(option?.value ?? null)}
            placeholder="Choisir un rôle"
            className="w-full"
          />
        </div>

        {selectedRoleId && (
          <>
            <div>
              <p className="text-md font-semibold">
                Points actuels :{" "}
                <span className="text-blue-600">
                  {currentPoints !== null ? currentPoints : 0}
                </span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ajouter des points</label>
              <input
                type="number"
                value={pointsToAdd}
                onChange={(e) => setPointsToAdd(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
                placeholder="Nombre de points à ajouter"
              />
              <button
                onClick={handleAddPoints}
                className="mt-2 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Ajouter
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Retirer des points</label>
              <input
                type="number"
                value={pointsToRemove}
                onChange={(e) => setPointsToRemove(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
                placeholder="Nombre de points à retirer"
              />
              <button
                onClick={handleRemovePoints}
                className="mt-2 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Retirer
              </button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
