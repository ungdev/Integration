import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Planning = {
    name: string;
    url: string;
};

const plannings: Planning[] = [
    {
        name: "Planning TC",
        url: `${import.meta.env.VITE_API_URL}/uploads/plannings/tc.pdf`,
    },
    {
        name: "Planning Bachelor IA",
        url: `${import.meta.env.VITE_API_URL}/uploads/plannings/bachelor.pdf`,
    },
    {
        name: "Planning Branche (non-alternant)",
        url: `${import.meta.env.VITE_API_URL}/uploads/plannings/branche.pdf`,
    },
    {
        name: "Planning Branche FISEA (alternants)",
        url: `${import.meta.env.VITE_API_URL}/uploads/plannings/fisea.pdf`,
    },
    {
        name: "Planning Master",
        url: `${import.meta.env.VITE_API_URL}/uploads/plannings/master.pdf`,
    },
];

export const PlanningSection = () => {
    const [availablePlannings, setAvailablePlannings] = useState<
        Record<string, boolean>
    >({});

    useEffect(() => {
        const checkAvailability = async () => {
            const availability: Record<string, boolean> = {};
            for (const planning of plannings) {
                try {
                    const response = await fetch(planning.url, { method: "HEAD" });
                    availability[planning.name] = response.ok;
                } catch {
                    availability[planning.name] = false;
                }
            }
            setAvailablePlannings(availability);
        };

        checkAvailability();
    }, []);

    return (
        <Card className="w-full max-w-3xl bg-gradient-to-br from-yellow-100 to-orange-200 mx-auto">
            <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-800 text-center">
                    📅 Plannings de la semaine d'Intégration
                </CardTitle>
                <p className="text-lg md:text-xl text-gray-700">
                    Retrouve ici tous les plannings (TC, Branche, FISEA, Master) et
                    télécharge-les.
                </p>
            </CardHeader>

            <CardContent className="space-y-12">
                {plannings.map((planning) => (
                    <Card
                        key={planning.name}
                        className="w-full max-w-3xl mx-auto"
                    >
                        {/* Titre planning centré */}
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-gray-800 text-center">
                                {planning.name}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {availablePlannings[planning.name] ? (
                                <>
                                    {/* PDF scrollable horizontal */}
                                    <div className="overflow-x-auto">
                                        <iframe
                                            src={planning.url}
                                            title={planning.name}
                                            className="w-full min-h-[600px] border rounded-lg"
                                        />
                                    </div>

                                    {/* Bouton centré */}
                                    <div className="flex justify-center">
                                        <a
                                            href={planning.url}
                                            download
                                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition"
                                        >
                                            Télécharger le planning
                                        </a>
                                    </div>
                                </>
                            ) : (
                                <p className="text-red-500 font-medium text-center">
                                    🚫 Ce planning n'est pas encore disponible.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
};
