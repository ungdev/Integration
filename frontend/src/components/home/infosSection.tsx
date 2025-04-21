import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";

export const Infos = () => {
  return (
    <div className="w-full bg-white text-gray-800">
      {/* Hero Carousel */}
      <div className="relative w-full overflow-hidden">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={0}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          className="w-full"
          style={{ height: "100%", maxHeight: "600px" }}
          effect="fade" // Smooth transition de fond
        >
          {["Home1", "Home2", "Home3", "Home4"].map((img, i) => (
            <SwiperSlide key={i} className="relative">
              <img
                src={`/img/${img}.jpg`}
                alt={`Photo ${i + 1}`}
                className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
              />
              {/* Overlay sombre */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent z-10" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Texte fixe qui reste par dessus le Swiper */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <h1 className="text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center drop-shadow-xl px-4">
            Bienvenue à l'UTT !
          </h1>
        </div>

        {/* SVG vague bas */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 500 50"
            preserveAspectRatio="none"
            className="w-full h-10 lg:h-16 fill-white"
          >
            <path d="M0,0 C150,50 350,0 500,50 L500,00 L0,0 Z" />
          </svg>
        </div>
      </div>


      {/* Texte d'info */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-16">
          <section className="text-center lg:text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-blue-700">
              L'intégration, c'est quoi ?
            </h3>
            <p className="text-center sm:text-lg leading-relaxed text-gray-700 max-w-3xl mx-auto">
              C'est l'événement où l'ensemble des étudiants de l'UTT se mobilise pour concocter aux nouveaux (comme toi) une incroyable semaine durant laquelle tu découvriras la vie sur le campus, rencontreras une tonne de nouveaux amis et démarreras ta nouvelle vie d'étudiant ! Le tout se fait dans la bonne humeur et avec bienveillance, l'objectif c'est juste de s'amuser à fond !
            </p>
          </section>

          <section className="text-center lg:text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-blue-700">
              La petite histoire
            </h3>
            <p className="text-center sm:text-lg leading-relaxed text-gray-700 max-w-3xl mx-auto">
              Chaque année, deux factions composées d'une multitude d'équipes s'affrontent. Le thème de cette année : <strong>Vilains vs Justificers</strong>.
            </p>
          </section>

          <section className="text-center lg:text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-blue-700">
              Ce site, c'est quoi ?
            </h3>
            <p className="text-center sm:text-lg leading-relaxed text-gray-700 max-w-3xl mx-auto">
              C'est ici que tu trouveras toutes les informations nécessaires au déroulement de la semaine d'inté. Par exemple, tu pourras prendre ta place pour le WEI ou regarder quelle faction est la plus proche de la victoire.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};