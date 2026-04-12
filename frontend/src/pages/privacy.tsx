// src/pages/privacy.tsx
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { PrivacySection } from "../privacy/privacySection";

export const PrivacyPage = () => {

    return (
        <div>
            <Navbar />
            <PrivacySection />
            <Footer />
        </div>
    );
}
