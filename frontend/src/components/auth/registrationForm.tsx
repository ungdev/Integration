import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { completeRegistration } from '../../services/requests/auth.service';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export const RegistrationForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [token, setToken] = useState<string | null>(null);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const t = queryParams.get('token');
        setToken(t);
    }, [location.search]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!token) {
            return setError('Token invalide ou manquant.');
        }

        if (password !== confirmPassword) {
            return setError('Les mots de passe ne correspondent pas.');
        }

        try {
            await completeRegistration(token, password);
            setSuccess(true);
            setTimeout(() => navigate('/'), 2000);
        } catch (err: any) {
            setError('Erreur lors de la validation : ' + err.response.data.message);
        }
    };

    return (
        <div
            className="relative min-h-screen flex items-center justify-center bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: "url('img/bg_26.png')" }}>
            <div className="min-h-screen flex items-center justify-center w-full">
                <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md transition-all duration-300">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Définir votre mot de passe</h2>

                    {error && (
                        <div className="text-red-600 bg-red-100 p-3 rounded mb-4 text-center flex items-center justify-center gap-2 transition-all duration-300">
                            ❌ <span>{error}</span>
                        </div>
                    )}

                    {success ? (
                        <div className="text-green-700 bg-green-100 p-3 rounded text-center flex items-center justify-center gap-2 transition-all duration-300">
                            ✅ <span>Mot de passe enregistré. Redirection...</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mot de passe
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirmer le mot de passe
                                </label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-200">
                                ✅ Valider
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
