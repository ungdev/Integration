import { Link, useNavigate } from "react-router-dom"; // Utiliser react-router-dom
import { getPermission } from "src/services/requests/user.service";

export const Navbar = () => {
  const permission  = getPermission(); 
  const navigate = useNavigate(); // Utiliser useNavigate pour la redirection

  // Si aucun rôle n'est défini, on redirige vers la page de login
  if (!permission) {
    navigate("/"); // Redirige vers la page de login
    return null; // Optionnel : Affiche rien pendant la redirection
  }

  const handleLogout = () => {
    // Supprimer le token authToken
    localStorage.removeItem('authToken');
    // Rediriger l'utilisateur vers la page de connexion ou une autre page appropriée
    window.location.href = '/';
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
          {/* Navbar Role-Based */}
          {permission === "Admin" && (
            <Link to="/admin" className="text-white hover:text-gray-300">Admin Dashboard</Link>
          )}

          {(permission === "Student" || permission === "Admin") && (
            <>
              <Link to="/Profil" className="text-white hover:text-gray-300">Mon compte</Link>
              <Link to="/Shotgun" className="text-white hover:text-gray-300">Shotgun</Link>
            </>
          )}

          {<Link onClick={handleLogout} className="text-white hover:text-gray-300" to={""}>Déconnexion</Link>}

        </div>
      </div>
    </nav>
  );
};
