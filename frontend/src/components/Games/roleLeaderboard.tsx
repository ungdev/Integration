import { useEffect, useState } from "react";
import { Role, RolePoint } from "../../interfaces/role.interface";
import { fetchAllRolePoints, fetchAvailableRoles } from "../../services/requests/role.service";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const RoleLeaderboard = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [rolePoints, setRolePoints] = useState<{ [key: number]: number }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const allRoles = await fetchAvailableRoles();
                const pointsArray: RolePoint[] = await fetchAllRolePoints(); // Annotated

                const pointsData: { [key: number]: number } = {};
                pointsArray.forEach(({ role_id, points }) => {
                    pointsData[role_id] = points;
                });

                setRoles(allRoles);
                setRolePoints(pointsData);
            } catch (error) {
                console.error("Erreur lors du chargement du classement :", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const sortedRoles = roles
        .map(role => ({
            ...role,
            points: rolePoints[role.roleId] ?? 0,
        }))
        .sort((a, b) => b.points - a.points);

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    🎉 Classement des Rôles
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10">
                {loading ? (
                    <p className="text-center text-gray-500">Chargement du classement...</p>
                ) : sortedRoles.length === 0 ? (
                    <p className="text-center text-gray-500">Aucun rôle disponible.</p>
                ) : (
                    <ul className="space-y-4">
                        {sortedRoles.map((role, index) => (
                            <li
                                key={role.roleId}
                                className={`flex justify-between items-center px-6 py-4 rounded-xl shadow-sm border ${index === 0
                                    ? "bg-yellow-300 text-white font-bold"
                                    : index === 1
                                        ? "bg-gray-300 text-white font-semibold"
                                        : index === 2
                                            ? "bg-orange-300 text-white font-semibold"
                                            : "bg-white"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">{getMedalEmoji(index)}</span>
                                    <span className="text-lg">{role.name}</span>
                                </div>
                                <span className="text-lg font-semibold">{role.points} pts</span>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
};

const getMedalEmoji = (index: number) => {
    switch (index) {
        case 0:
            return "🥇";
        case 1:
            return "🥈";
        case 2:
            return "🥉";
        default:
            return "🎯";
    }
};
