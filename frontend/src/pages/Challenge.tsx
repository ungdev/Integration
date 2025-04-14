import { ChallengeList } from "../components/challenge/challengeList";
import { Navbar } from "../components/navbar";


export const ChallPage = () => (
    
 <div>
    <Navbar />
    <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
            <ChallengeList/>
        </div>
    </div>
    <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2025 Semaine d'Intégration UTT</p>
      </footer>
 </div>
);
