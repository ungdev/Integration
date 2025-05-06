import { useRef, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { handleCASTicket, loginUser, requestPasswordUser } from "../../services/requests/auth.service";

export const AuthForm = () => {
    const userRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [casProcessed] = useState(() => {
        return localStorage.getItem("casProcessed") === "true";
    });

    useEffect(() => {
        if (!casProcessed) {
            handleCASLogin();
        }
        if (userRef.current) userRef.current.focus();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const token = await loginUser(formData.email, formData.password);
            if (token) {
                localStorage.setItem("authToken", token);
                window.location.href = "/Home";
            }
        } catch (err: any) {
            console.error(err);
            setError("Échec de la connexion. Vérifie ton email et ton mot de passe.");
        }
    };

    const UTT_Connexion = () => {
        //const SERVICE_URL = import.meta.env.VITE_SERVICE_URL;
        //const CAS_LOGIN_URL = import.meta.env.VITE_CAS_LOGIN_URL;
        const loginUrl = `https://cas.utt.fr/cas/login?service=${encodeURIComponent('https://integration.utt.fr')}`;
        window.location.href = loginUrl;
        localStorage.setItem("casProcessed", "false");
    };

    const handleCASLogin = async () => {
        if (window.location.pathname === "/Home") return;
        if (localStorage.getItem("casProcessed") === "true") return;

        localStorage.setItem("casProcessed", "true");

        const urlParams = new URLSearchParams(window.location.search);
        const ticket = urlParams.get("ticket");

        if (ticket) {
            try {
                const { token } = await handleCASTicket(ticket);
                localStorage.setItem("authToken", token);
                setTimeout(() => window.location.href = "/Home", 300);
            } catch (error) {
                console.error("CAS Login failed:", error);
                setError("Authentification CAS échouée. Réessaie.");
            }
        }
    };

    const handlePasswordReset = async () => {
        const email = prompt("Entre ton adresse email pour réinitialiser ton mot de passe :");
        if (email && email.includes("@")) {
            try {
                const res = await requestPasswordUser(email);
                if (!res.ok) alert("Un lien de réinitialisation a été envoyé à ton adresse email !");
            } catch {
                alert("Erreur lors de l'envoi de l'email. Vérifie l'adresse.");
            }
        } else {
            alert("Adresse email invalide.");
        }
    };

    return (
        <div
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('img/background.png')" }}
        >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="z-10 w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center">Connexion</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                ref={userRef}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Button type="submit" className="w-full py-2 bg-blue-600 text-white hover:bg-blue-700 transition">
                            Connexion
                        </Button>

                        <Button
                            type="button"
                            className="w-full py-2 bg-blue-900 text-white hover:bg-gray-700 transition"
                            onClick={UTT_Connexion}
                        >
                            Connexion Étudiant UTT (CAS)
                        </Button>
                        <Button
                            type="button"
                            className="w-full py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                            onClick={handlePasswordReset}
                        >
                            Mot de passe oublié ?
                        </Button>

                        <p className="text-center text-sm text-gray-500">
                            ✉️ Tu es un nouveau ? Vérifie ton mail pour activer ton compte.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
