import { Navbar } from "src/components/navbar";
import { ParrainageNewStudent, ParrainageStudent } from "src/components/Parrainnage/parrainnageForm";
import PrivateRoute from "src/components/utils/privateroute";

export const ParrainnagePage = () => (
    
 <div>
    <Navbar />
    <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">


        {/* Ajout d'un espacement entre les composants */}
        <PrivateRoute permissionRequired="Nouveau"><ParrainageNewStudent /></PrivateRoute>
        <PrivateRoute permissionRequired="Student"><ParrainageStudent /></PrivateRoute>
        </div>
    </div>
 </div>
);
