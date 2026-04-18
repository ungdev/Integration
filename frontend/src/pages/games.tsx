import { RoleLeaderboard } from "../components/Games/roleLeaderboard";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";


export const GamesPage = () => (

    <div>
        <Navbar />
        <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <RoleLeaderboard />
            </div>
        </div>
        <Footer />
    </div>
);
