import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  fetchAvailableRoles,
  fetchUserPreferences,
  updateUserPreferences,
} from "../../services/requests/role.service";
import { Role } from "../../interfaces/role.interface";

export const UserPreferences = () => {
  const { register, handleSubmit, setValue } = useForm<Record<string, boolean>>();
  const [loading, setLoading] = useState(false);
  const [commissions, setCommissions] = useState<Role[]>([]);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const roles = await fetchAvailableRoles();
        setCommissions(roles);

        const userPreferences = await fetchUserPreferences();
        userPreferences.forEach((roleId: number) => {
          setValue(roleId.toString(), true);
        });
      } catch (error) {
        console.error("Erreur lors du chargement des préférences :", error);
      }
    };

    fetchPreferences();
  }, [setValue]);

  const onSubmit = async (data: Record<string, boolean>) => {
    setLoading(true);
    const selectedRoleIds = Object.entries(data)
      .filter(([_, isSelected]) => isSelected)
      .map(([roleId]) => parseInt(roleId));

    try {
      await updateUserPreferences(selectedRoleIds);
      alert("Préférences mises à jour !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-10 space-y-10 max-w-5xl mx-auto">
      <Card className="w-full p-6 rounded-2xl shadow space-y-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Préférences de commission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {commissions.map(({ roleId, name, description }) => (
                <div key={roleId} className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`role-${roleId}`}
                      {...register(roleId.toString())}
                      className="accent-blue-600"
                    />
                    <label htmlFor={`role-${roleId}`} className="text-sm font-medium">
                      {name}
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">{description}</p>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              className="mt-6 w-full sm:w-auto"
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
