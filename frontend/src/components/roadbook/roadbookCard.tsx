import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export const RoadBookCard = () => (
    <div className="flex flex-col items-center px-4 py-8 space-y-8 max-w-full min-h-screen mx-auto">
        <Card className="w-full p-6 rounded-2xl shadow-md space-y-4">
            <h2 className="text-3xl font-bold text-center">
                <span role="img" aria-label="rocket">📖</span>{" "}
                <span>Roadbook de l'intégration</span>{" "}
                <span role="img" aria-label="backpack">🚗</span>
            </h2>

            <div className="text-center text-gray-700 space-y-1">
                <p>
                    C'est dans ce livret, que vous pourrez retrouver les informations les plus importantes pour naviguer au travers de l'Intégration. Vous y trouverez les <strong>contacts</strong> des super-orgas, de l'équipe prévention, de l'infirmerie ainsi que du <strong>téléphone d'astreinte</strong>, que vous pourrez appeler en cas de problème.
                    <br />
                    Un texte résumant toute la <strong>prévention</strong> et les bons gestes à adopter se trouve à l'intérieur.
                    <br />
                    Il y aura de même à votre disposition les <strong>plannings</strong> pour être toujours à l'heure, ainsi qu'une super description de chaque activité.
                    <br /><br />
                    On vous rappelle que <strong>LES ACTIVITES NE SONT PAS OBLIGATOIRES</strong>.
                    <br /><br />
                    Bonne Intégration à tous !
                </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
                <Link to={import.meta.env.VITE_ROADBOOK_URL_FRENCH}>
                    <Button className="cursor-pointer">
                        <span role="img" aria-label="lien" className="mr-2">🔗</span>
                        Accéder à la version Française
                    </Button>
                </Link>
                {/* <Link to={import.meta.env.VITE_ROADBOOK_URL_ENGLISH}>
            <Button variant="link" className="cursor-pointer">
              English Version
            </Button>
          </Link> */}
                <p className="text-destructive">An english version will be available soon !</p>
            </div>
        </Card>
    </div>
);
