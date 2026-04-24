import { Footer } from "../components/footer";
import { Infos } from "../components/home/infosSection";
import { SocialLinks } from "../components/home/socialSection";
import { Navbar } from "../components/navbar";

const HomePage = () => (
    <div>
        <Navbar />
        <Infos />
        <SocialLinks />

        <Footer />
    </div>
);

export default HomePage;
