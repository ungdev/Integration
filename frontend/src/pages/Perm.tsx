import { Navbar } from "src/components/navbar";
import { Shotgun } from "../components/shotgun/shotgunSection";
import { PagePermanence } from "src/components/permanence/permForm";

export const PermPage = () => (
    
 <div>
    <Navbar />
    <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
            <PagePermanence/>
        </div>
    </div>
 </div>
);
