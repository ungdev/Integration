import { useEffect, useState } from "react";

import { checkPreRegisterStatus } from "../../services/requests/event.service";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const PreregisterCESection = () => {
    const [isPreRegistrationOpen, setIsPreRegistrationOpen] = useState(false);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const status = await checkPreRegisterStatus();
                setIsPreRegistrationOpen(status);
            } catch {
                alert("Erreur lors de la récupération du statut de pré-inscription.");
            }
        };
        fetchStatus();
    }, []);

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    Pré-inscription personnelle
                </CardTitle>
                <p className="text-lg md:text-xl text-gray-700 text-center">
                    Une réponse <u>par étudiant</u>
                </p>
            </CardHeader>
            <CardContent className="space-y-10">
                {isPreRegistrationOpen ? (
                    <div className="relative pb-[56.25%] rounded-xl shadow-lg overflow-hidden">
                        <iframe
                            src="https://forms.gle/32yHKGSTzfFvp7NP9"
                            className="absolute inset-0 w-full h-full border-none"
                            title="Formulaire de pré-inscription CE"
                            loading="lazy"
                        >
                            Chargement…
                        </iframe>
                    </div>
                ) : (
                    <p className="text-center text-red-500 text-lg font-semibold">
                        🚫 La pré-inscription est actuellement fermée.
                    </p>
                )}
            </CardContent>
        </Card>
    );
};
