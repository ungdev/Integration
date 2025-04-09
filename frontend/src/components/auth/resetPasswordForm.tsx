import { useState, useEffect } from 'react';
import { resetPasswordUser } from '../../services/requests/auth.service';

export const ResetPasswordForm = () => {

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get("token");
        if (!tokenFromUrl) {
            alert("Token invalide ou manquant.");
        }
        setToken(tokenFromUrl);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            alert("Lien invalide ou expiré.");
            return;
        }

        if (password.length < 6) {
            alert("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        setLoading(true);
        try {
            const response = await resetPasswordUser(token,password);
            if (response) {
                alert("Mot de passe modifié avec succès.");
                window.location.href = "/";
            }
        } catch (error) {
            alert("Erreur de connexion au serveur.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('img/background.png')" }}
        >
        <div className="formNouveau login active min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">Réinitialiser le mot de passe</h1>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe :</label>
                    <input
                        type="password"
                        className="mt-1 w-full border border-gray-300 p-2 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe :</label>
                    <input
                        type="password"
                        className="mt-1 w-full border border-gray-300 p-2 rounded"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded-md text-white ${loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"} transition`}
                >
                    {loading ? "Chargement..." : "Réinitialiser"}
                </button>
            </form>
        </div>
    </div>
    );
};
