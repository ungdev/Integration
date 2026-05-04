import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar";
import { SdiSection } from "../components/WEI_SDI_Food/sdiSection";

const SdiPage = () => (
    <div>
        <Navbar />
        <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <SdiSection />
            </div>
        </div>
        <Footer />
    </div>
);

export default SdiPage;
