import { Navbar } from "../components/navbar";
import { WeiSection } from "../components/WEI_SDI_Food/weiSection";
import { TentPublic } from "../components/tent/tentSection";
import { useNavigate } from "react-router-dom";
import { getPermission } from "../services/requests/user.service";

export const WeiPage = () => {

    const navigate = useNavigate();
    const permission = getPermission();

    if (!permission) {
        navigate("/");
        return null;
    }
    
  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <WeiSection />
          {(permission === "Nouveau" || permission === "Admin") && <TentPublic />}
        </div>
      </div>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2025 Semaine d'Intégration UTT</p>
      </footer>
    </div>
  );
};