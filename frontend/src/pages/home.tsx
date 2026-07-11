import { Footer } from '../components/footer';
import { Infos } from '../components/home/infosSection';
import { SocialLinks } from '../components/home/socialSection';
import UrgencyModal from '../components/home/urgencyModal';
import { Navbar } from '../components/navbar';

const HomePage = () => (
    <div>
        <Navbar />
        <Infos />
        <UrgencyModal />
        <SocialLinks />
        <Footer />
    </div>
);

export default HomePage;
