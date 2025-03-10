import { Navbar } from "../components/navbar";
import { UserPreferences } from "../components/profil/roleForm";

export const ProfilPage = () => {

  return (
    <div>
      <Navbar />
      <UserPreferences />

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2025 Semaine d'Intégration UTT</p>
      </footer>
    </div>
  );
}