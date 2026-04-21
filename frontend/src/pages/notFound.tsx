import { Link } from "react-router-dom";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { getToken } from "../services/requests/auth.service";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export const NotFoundPage = () => {
    const isAuthenticated = Boolean(getToken());

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main
                className="relative flex-1 flex items-center justify-center bg-no-repeat bg-cover bg-center px-4"
                style={{ backgroundImage: "url('img/bg_25.jpg')" }}
            >
                <div className="absolute inset-0 bg-black/55" aria-hidden="true"></div>

                <Card className="relative z-10 w-full max-w-xl text-center shadow-lg">
                    <CardHeader>
                        <p className="text-sm font-semibold text-blue-700">Erreur 404</p>
                        <CardTitle className="mt-2 text-3xl font-bold text-gray-900">
                            Page introuvable
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <p className="text-gray-600">
                            Oups, la page que tu cherches n'existe pas ou a été déplacée.
                        </p>

                        <div className="mt-8 flex justify-center gap-3">

                            {isAuthenticated ? (
                                <Link
                                    to="/home"
                                    className="rounded-md bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
                                >
                                    Retour à l'accueil
                                </Link>
                            ) : (
                                <Link
                                    to="/"
                                    className="rounded-md bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
                                >
                                    Se connecter
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>

            <Footer />
        </div>
    );
};
