import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar";
import { PreregisterCESection } from "../components/shotgun/preregisterCESection";
import { PreregisterTeamSection } from "../components/shotgun/preregisterTeamSection";
import { Shotgun } from "../components/shotgun/shotgunSection";

const ShotgunPage = () => (
    <div>
        <Navbar />
        <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                <PreregisterCESection />
                <PreregisterTeamSection />
                <Shotgun />
            </div>
        </div>
        <Footer />
    </div>
);

export default ShotgunPage;
