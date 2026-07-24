import { Footer } from '../components/footer';
import EmergencyModal from '../components/home/emergencyModal';
import { LegalsSection } from '../components/legals/legalsSection';
import { Navbar } from '../components/navbar';

const LegalsPage = () => (
    <div>
        <Navbar />
        <EmergencyModal />
        <LegalsSection />
        <Footer />
    </div>
);

export default LegalsPage;
