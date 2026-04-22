import { useEffect, useState } from "react";
import { checkFoodStatus } from "../../services/requests/event.service";
import { getPermission } from "../../services/requests/user.service";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const FoodSection = () => {
    const [isFoodOpen, setIsFoodOpen] = useState(false);
    const [isMenuAvailable, setIsMenuAvailable] = useState(false);

    const permission = getPermission();
    const menuUrl = `${import.meta.env.VITE_API_URL}/uploads/foodmenu/FoodMenu.pdf`;

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.billetweb.fr/js/export.js";
        script.async = true;
        document.body.appendChild(script);

        fetchStatus();
        checkMenuAvailability();
    }, []);

    const fetchStatus = async () => {
        try {
            const status = await checkFoodStatus();
            setIsFoodOpen(status);
        } catch (error) {
            alert("Erreur lors de la récupération du statut de la nourriture.");
        }
    };

    const checkMenuAvailability = async () => {
        try {
            const response = await fetch(menuUrl, { method: "HEAD" });
            if (response.ok) {
                setIsMenuAvailable(true);
            }
        } catch (error) {
            // Ne rien faire si le fichier n'est pas disponible
        }
    };


    return (
        <Card className="w-full max-w-6xl mx-auto bg-gradient-to-br from-blue-100 to-purple-200">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    Prends tes repas pour la semaine d'Intégration !
                </CardTitle>
                <p className="text-lg md:text-xl text-gray-700 text-center">
                    Réserve dès maintenant tes repas servis pendant la semaine d'Intégration !
                </p>
            </CardHeader>
            <CardContent className="space-y-10">
                {!isMenuAvailable ? (
                    <div className="surface-card p-6 text-center">
                        <p className="text-xl text-red-600 font-semibold">
                            🚫 Les menus de la semaine ne sont pas encore disponibles.
                        </p>
                        <p className="text-gray-600 mt-2">
                            Reste connecté, ils seront bientôt publiés !
                        </p>
                    </div>
                ) : (
                    <Card className="w-full max-w-6xl mx-auto">
                        <CardHeader>
                            <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                                📄 Menus de la semaine
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-10">
                            <iframe
                                src={menuUrl}
                                title="Menu PDF"
                                className="w-full h-[600px] border rounded-lg"
                            />
                            <a
                                href={menuUrl}
                                download
                                className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition"
                                target="blank"
                            >
                                Télécharger le menu
                            </a>
                        </CardContent>
                    </Card>
                )}
                {!isFoodOpen ? (
                    <div className="surface-card p-6 text-center">
                        <p className="text-xl text-red-600 font-semibold">
                            🚫 La billetterie des repas n'est pas encore disponible.
                        </p>
                        <p className="text-gray-600 mt-2">
                            Reste connecté, elle ouvrira bientôt !
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="surface-card overflow-hidden">
                            <iframe
                                title="Billetterie Repas"
                                src="https://www.billetweb.fr/billetterie-repas-semaine-inte-a25"
                                className="w-full h-[600px] border-none"
                            />
                        </div>
                        {(permission === "Student" || permission === "Admin") && (
                            <div className="surface-card overflow-hidden">
                                <span className="items-center rounded-md bg-red-400/10 px-2 py-1 text-s font-medium text-red-400 inset-ring inset-ring-red-400/20 mx-auto mt-4 mb-4 block w-max">
                                    La billetterie du repas test est réservée aux Chefs d'Equipe et Organisateurs de l'Intégration 2025.
                                </span>
                                <iframe
                                    title="Billetterie Repas Test"
                                    src="https://www.billetweb.fr/billetterie-repas-test-a25"
                                    className="w-full h-[600px] border-none"
                                />
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card >
    );
};
