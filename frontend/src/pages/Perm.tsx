import { Navbar } from "../components/navbar";
import { PagePermanence } from "../components/permanence/permForm";

export const PermPage = () => (
    
 <div>
    <Navbar />
    <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
            <PagePermanence/>
        </div>
    </div>
    <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2025 Semaine d'Intégration UTT</p>
    </footer>
 </div>
);
