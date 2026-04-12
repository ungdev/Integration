// src/pages/index.tsx
import { Navbar } from "../components/navbar";
import { Infos } from "../components/home/infosSection";
import { SocialLinks } from "../components/home/socialSection";
import { Footer } from "../components/footer";

export const HomePage = () => {

  return (
    <div>
      <Navbar />
      <Infos />
      <SocialLinks />

      <Footer />
    </div>
  );
}
