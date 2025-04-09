import { Navbar } from "src/components/navbar";
import { useNavigate } from "react-router-dom";
import { ParrainageNewStudent, ParrainageStudent } from "src/components/Parrainnage/parrainnageForm";
import PrivateRoute from "src/components/utils/privateroute";
import { getPermission } from "src/services/requests/user.service";


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
    </div>
    );
}