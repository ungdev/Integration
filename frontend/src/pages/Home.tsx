// src/pages/index.tsx
import { Navbar } from "../components/navbar";
import { Infos } from "../components/home/infosSection";
import {SocialLinks} from "../components/home/socialSection";
import { useAuth } from "../context/authContext";

export const HomePage = () => {

  return (
    <div>
      <Navbar />
      <Infos />
      <SocialLinks />

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2025 Semaine d'Intégration UTT</p>
      </footer>
    </div>
  );
}
