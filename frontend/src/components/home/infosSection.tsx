import 'swiper/swiper-bundle.css';

import { Link } from 'react-router-dom';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Button } from '../ui/button';
import { RevealSection } from '../ui/revealSection';
import { Team } from './teamSection';

export const Infos = () => (
    <div className="w-full bg-white text-gray-800">
        {/* Hero Carousel */}
        <div className="relative w-full overflow-hidden h-[280px] sm:h-[360px] md:h-[460px] lg:h-[600px]">
            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={0}
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: true }}
                loop={true}
                className="w-full h-full"
                effect="fade" // Smooth transition de fond
            >
                {['Home1', 'Home2', 'Home3', 'Home4'].map((img, i) => (
                    <SwiperSlide key={i} className="relative h-full">
                        <img
                            src={`/img/${img}.jpg`}
                            alt={`${i + 1}`}
                            className="w-full h-full object-cover object-center transition-all duration-1000 ease-in-out"
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
                <svg viewBox="0 0 500 50" preserveAspectRatio="none" className="w-full h-10 lg:h-16 fill-white">
                    <path d="M0,0 C150,50 350,0 500,50 L500,00 L0,0 Z" />
                </svg>
            </div>
        </div>

        {/* Team */}
        <RevealSection>
            <Team></Team>
        </RevealSection>

        {/* Texte d'info */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-16">
                <RevealSection delay={0.2}>
                    <section className="text-center lg:text-center">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-blue-700">
                            L'intégration, c'est quoi ?
                        </h3>
                        <p className="text-center sm:text-lg leading-relaxed text-gray-700 max-w-3xl mx-auto">
                            C'est l'événement où l'ensemble des étudiants de l'UTT se mobilise pour concocter aux
                            nouveaux (comme toi) une incroyable semaine durant laquelle tu découvriras la vie sur le
                            campus, rencontreras une tonne de nouveaux amis et démarreras ta nouvelle vie d'étudiant !
                            Le tout se fait dans la bonne humeur et avec bienveillance, l'objectif c'est juste de
                            s'amuser à fond !
                        </p>
                    </section>
                </RevealSection>

                <RevealSection delay={0.4}>
                    <section className="text-center lg:text-center">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-blue-700">
                            La petite histoire
                        </h3>
                        <p className="text-center sm:text-lg leading-relaxed text-gray-700 max-w-3xl mx-auto">
                            Chaque année, deux factions composées d'une multitude d'équipes s'affrontent. Le thème de
                            cette année : <strong>Divinités vs Monstres</strong>.
                        </p>
                    </section>
                </RevealSection>

                <RevealSection delay={0.6}>
                    <section className="text-center lg:text-center">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-blue-700">
                            Ce site, c'est quoi ?
                        </h3>
                        <p className="text-center sm:text-lg leading-relaxed text-gray-700 max-w-3xl mx-auto">
                            C'est ici que tu trouveras toutes les informations nécessaires au déroulement de la semaine
                            d'inté. Par exemple, tu pourras prendre ta place pour le WEI ou regarder quelle faction est
                            la plus proche de la victoire.
                        </p>
                    </section>
                </RevealSection>

                <RevealSection delay={0.8}>
                    <section className="text-center lg:text-center">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-blue-700">
                            Le Roadbook de l'inté
                        </h3>
                        <p className="text-center sm:text-lg leading-relaxed text-gray-700 max-w-3xl mx-auto mb-4">
                            Retrouve ici toutes les informations de l'intégration ! Les plannings, la prévention, les
                            activités, les menus… Tout pour passer des moments incroyables !
                        </p>
                        <Button asChild className="bg-pink-600 hover:bg-pink-800">
                            <Link to="/roadbook">Accéder au Roadbook</Link>
                        </Button>
                    </section>
                </RevealSection>
            </div>
        </div>

        {/* Roulette des partenaires */}
        <div className="bg-gray-100 py-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-8">Nos Partenaires</h3>

            <div className="max-w-screen-xl mx-auto px-4">
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={30}
                    slidesPerView={2}
                    breakpoints={{
                        640: { slidesPerView: 3 },
                        1024: { slidesPerView: 5 },
                    }}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    loop={true}
                    className="px-4">
                    {[
                        {
                            logo: 'CIC.png',
                            name: 'CIC',
                            link: 'https://www.cic.fr/fr/particuliers/comptes/jeunes-pouvoir-avancer.html',
                        },
                        {
                            logo: 'CVEC.png',
                            name: 'CVEC',
                            link: 'https://www.crous-reims.fr/le-crous/la-contribution-vie-etudiante-et-de-campus-cvec-une-demarche-obligatoire-et-utile-pour-les-etudiants/',
                        },
                        { logo: 'DAMONTE.png', name: 'DAMONTE', link: 'https://www.yves-damonte.fr/' },
                        { logo: 'FONDATIONUTT.png', name: 'Fondation UTT', link: 'https://fondation.utt.fr/' },
                        { logo: 'POPEYE.png', name: 'POPEYE', link: 'https://popeye-troyes.fr/' },
                        { logo: 'UTT.png', name: 'UTT', link: 'https://utt.fr/' },
                        { logo: 'SECUTT.png', name: 'SECUTT', link: 'https://ffssaube.fr/secutt/' },
                    ].map((partner, i) => (
                        <SwiperSlide key={i} className="flex items-center justify-center">
                            <a
                                href={partner.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="surface-card p-4 flex items-center justify-center w-40 h-28 sm:w-48 sm:h-32 transition-transform duration-300 hover:scale-105">
                                <img
                                    src={`/img/${partner.logo}`}
                                    alt={`Logo ${partner.name}`}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    </div>
);
