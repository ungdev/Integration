import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "../../styles/components/ui/input";
import { Button } from "../../styles/components/ui/button";
import { handleCASTicket, loginUser, registerUser } from "src/services/requests/auth.service";

export default function AuthPage() {
    const userRef = useRef<HTMLInputElement>(null);
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: "", password: "", firstName: "", lastName: "" });
    const [error, setError] = useState<string | null>(null);

    // Empêcher le CAS de s'exécuter plusieurs fois
    const [casProcessed, setCasProcessed] = useState(() => {
        return localStorage.getItem("casProcessed") === "true";
    });

    useEffect(() => {
        if (!casProcessed) {
            handleCASLogin();
        }
        if (userRef.current) userRef.current.focus();
    }, []); // Exécute une seule fois au chargement

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
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
            setError("Login failed. Please check your credentials.");
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const msg = await registerUser(formData.firstName, formData.lastName, formData.email, formData.password);
            console.log(msg);
        } catch (err: any) {
            console.error(err);
            setError("Registration failed. Please try again.");
        }
    };

    const UTT_Connexion = () => {
        const SERVICE_URL = process.env.REACT_APP_SERVICE_URL || "default";
        const CAS_LOGIN_URL = process.env.REACT_APP_CAS_LOGIN_URL || "default";
        const loginUrl = `${CAS_LOGIN_URL}?service=${encodeURIComponent(SERVICE_URL)}`;
        window.location.href = loginUrl;
        localStorage.setItem("casProcessed", "false")
    };

    const handleCASLogin = async () => {
        if (window.location.pathname === "/Home") return; // Si on est déjà sur Home, ne rien faire
        if (localStorage.getItem("casProcessed") === "true") return; // Empêche un appel multiple

        localStorage.setItem("casProcessed", "true"); // Marquer CAS comme traité

        const urlParams = new URLSearchParams(window.location.search);
        const ticket = urlParams.get("ticket");

        if (ticket) {
            try {
                const { token } = await handleCASTicket(ticket);
                localStorage.setItem("authToken", token);

                setTimeout(() => {
                    window.location.href = "/Home";
                }, 300); // Délai pour stabiliser le rendu avant redirection

            } catch (error) {
                console.error("CAS Login failed:", error);
                setError("CAS authentication failed. Please try again.");
            }
        }
    };

    return (
        <div
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('img/background.png')" }}
        >
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="z-10 w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center">{isLogin ? "Login" : "Sign Up"}</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-6">
                    <div className="space-y-4">
                        {!isLogin && (
                            <>
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                                    <Input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <Input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                                </div>
                            </>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <Input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                            {isLogin ? "Login" : "Register"}
                        </Button>
                        <Button
                            type="button"
                            className="w-full py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                            onClick={() => setIsLogin(prev => !prev)}
                        >
                            {isLogin ? "New here? Sign Up" : "Already have an account? Log In"}
                        </Button>
                        <Button
                            type="button"
                            className="w-full py-2 bg-blue-900 text-white rounded-md hover:bg-gray-400 transition"
                            onClick={UTT_Connexion}
                        >
                            {"Etudiants UTT"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
