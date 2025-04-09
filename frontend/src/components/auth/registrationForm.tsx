import { useState, useEffect } from "react";
import { Input } from "../../styles/components/ui/input";
import { Button } from "../../styles/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { completeRegistration } from "src/services/requests/auth.service";

export const RegistrationForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken] = useState<string | null>(null);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const t = queryParams.get("token");
        setToken(t);
    }, [location.search]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!token) {
            return setError("Token invalide ou manquant.");
        }

        if (password !== confirmPassword) {
            return setError("Les mots de passe ne correspondent pas.");
        }

        try {
            const response = await completeRegistration(token, password);
            setSuccess(true);
            setTimeout(() => navigate("/"), 2000);
        } catch (err) {
            setError("Erreur lors de la validation. Le lien est peut-être expiré ou invalide.");
        }
    };

    return (
        <div
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('img/background.png')" }}
        >
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Définir votre mot de passe</h2>

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                {success ? (
                    <p className="text-green-600 text-center">Mot de passe enregistré. Redirection...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Mot de passe</label>
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Confirmer le mot de passe</label>
                            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 text-white">
                            Valider
                        </Button>
                    </form>
                )}
            </div>
        </div>
    </div>
    );
}
