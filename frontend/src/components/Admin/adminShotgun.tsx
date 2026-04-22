import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShotgunAttemptRow } from "../../interfaces/event.interface";
import { getShotgunAttemptsAdmin } from "../../services/requests/event.service";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const formatResponseTime = (timestamp: string | null, baseline: number | null): string => {
    if (!timestamp || baseline === null) {
        return "-";
    }

    const current = new Date(timestamp).getTime();
    if (Number.isNaN(current)) {
        return "-";
    }

    const diffMs = Math.max(0, current - baseline);
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    const milliseconds = diffMs % 1000;

    return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
};

export const AdminShotgunRanking = () => {
    const [attempts, setAttempts] = useState<ShotgunAttemptRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchShotgunAttempts = async () => {
            try {
                const data = await getShotgunAttemptsAdmin();
                setAttempts(data);
            } catch {
                setError("Impossible de récupérer les résultats du shotgun.");
            } finally {
                setLoading(false);
            }
        };

        void fetchShotgunAttempts();
    }, []);

    const baselineTimestamp = useMemo(() => {
        const firstWithTimestamp = attempts.find((entry) => entry.timestamp);
        if (!firstWithTimestamp?.timestamp) {
            return null;
        }
        const parsed = new Date(firstWithTimestamp.timestamp).getTime();
        return Number.isNaN(parsed) ? null : parsed;
    }, [attempts]);

    return (
        <Card className="w-full max-w-6xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    Shotgun - Ordre de réponse
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 text-center">
                    Temps de réponse calculé par rapport a la première équipe ayant répondu.
                </p>

                {loading && <p className="text-center text-gray-600">Chargement...</p>}
                {!loading && error && <p className="text-center text-red-600">{error}</p>}

                {!loading && !error && (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-4 py-3 text-left">Ordre</th>
                                    <th className="px-4 py-3 text-left">Equipe</th>
                                    <th className="px-4 py-3 text-left">Nb chefs d'equipe</th>
                                    <th className="px-4 py-3 text-left">Temps de reponse</th>
                                    <th className="px-4 py-3 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attempts.map((attempt, index) => (
                                    <tr key={attempt.id} className="border-t border-gray-200">
                                        <td className="px-4 py-3 font-semibold">{index + 1}</td>
                                        <td className="px-4 py-3">{attempt.teamName || "Equipe inconnue"}</td>
                                        <td className="px-4 py-3">{attempt.leaderCount}</td>
                                        <td className="px-4 py-3">{formatResponseTime(attempt.timestamp, baselineTimestamp)}</td>
                                        <td className="px-4 py-3">
                                            {attempt.teamId ? (
                                                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                                                    <Link to={`/admin/teams?teamId=${attempt.teamId}`}>Voir l'equipe</Link>
                                                </Button>
                                            ) : (
                                                <span className="text-gray-500">Aucun lien</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {attempts.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                            Aucune equipe n'a encore repondu au shotgun.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
