import { Footer } from '../components/footer';
import EmergencyModal from '../components/home/emergencyModal';
import { Navbar } from '../components/navbar';
import { PrivacySection } from '../components/privacy/privacySection';

const PrivacyPage = () => (
    <div>
        <Navbar />
        <EmergencyModal />
        <PrivacySection />
        <Footer />
    </div>
);

export default PrivacyPage;
