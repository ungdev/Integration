import { Navbar } from "../components/navbar";
import { useNavigate } from "react-router-dom";
import { ParrainageNewStudent, ParrainageStudent } from "../components/Parrainnage/parrainnageForm";
import { getPermission } from "../services/requests/user.service";


export const ParrainnagePage = () => {

    const navigate = useNavigate();
    const permission = getPermission();

    if (!permission) {
        navigate("/");
        return null;
}
  return(
    <div>
        <Navbar />
        <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

            {(permission === "Nouveau" || permission === "Admin") && (
                <ParrainageNewStudent />)}

            {(permission === "Student" || permission === "Admin") && (    
                <ParrainageStudent />)}
            </div>
        </div>
        <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2025 Semaine d'Intégration UTT</p>
      </footer>
    </div>
    );
}