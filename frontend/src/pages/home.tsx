import { Footer } from '../components/footer';
import EmergencyModal from '../components/home/emergencyModal';
import { Infos } from '../components/home/infosSection';
import { SocialLinks } from '../components/home/socialSection';
import { Navbar } from '../components/navbar';

const HomePage = () => (
    <div>
        <Navbar />
        <Infos />
        <EmergencyModal />
        <SocialLinks />
        <Footer />
    </div>
);

export default HomePage;
