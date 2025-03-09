// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom"; // Utiliser react-router-dom
import { useAuth } from "../context/authContext"; // Contexte pour gérer l'authentification
import { getRole } from "src/services/auth/role.service";

export const Navbar = () => {
  const role  = getRole(); // Récupérer le rôle via le contexte
  const navigate = useNavigate(); // Utiliser useNavigate pour la redirection

  // Si aucun rôle n'est défini, on redirige vers la page de login
  if (!role) {
    navigate("/"); // Redirige vers la page de login
    return null; // Optionnel : Affiche rien pendant la redirection
  }

  return (
    <nav className="bg-blue-600 p-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-white text-2xl font-semibold">
          <Link to="/Home">UTT Integration</Link>
        </div>
        <div className="flex space-x-6">
          {/* Liens de la Navbar */}
          <Link to="/Home" className="text-white hover:text-gray-300">Home</Link>
          <Link to="#about" className="text-white hover:text-gray-300">L'intégration</Link>
          <Link to="#contact" className="text-white hover:text-gray-300">Contact</Link>

          {/* Navbar Role-Based */}
          {role === "admin" && (
            <Link to="/admin" className="text-white hover:text-gray-300">Admin Dashboard</Link>
          )}

          {role === "student" && (
            <Link to="/student" className="text-white hover:text-gray-300">Mon compte</Link>
          )}

          {/* Login/Logout */}
          {role ? (
            <Link to="/logout" className="text-white hover:text-gray-300">Logout</Link>
          ) : (
            <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};
