// src/pages/legals.tsx
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { LegalsSection } from "../components/legals/legalsSection";

export const LegalsPage = () => {

    return (
        <div>
            <Navbar />
            <LegalsSection />
            <Footer />
        </div>
    );
}
