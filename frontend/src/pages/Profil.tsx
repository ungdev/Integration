import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/navbar";
import { UserPreferences } from "../components/profil/roleForm";
import { getPermission } from "src/services/requests/user.service";
import { ProfilForm } from "src/components/profil/profilForm";

export const ProfilPage = () => {


    const navigate = useNavigate();
    const permission = getPermission();

    if (!permission) {
        navigate("/");
        return null;
}

  return (
    <div>
      <Navbar />
      < ProfilForm/>
      {(permission === "Student" || permission === "Admin") && (<UserPreferences />)}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2025 Semaine d'Intégration UTT</p>
      </footer>
    </div>
  );
}