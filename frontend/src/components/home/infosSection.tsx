// src/components/Welcome.tsx
export const Infos = () => {
  return (
    <div className="container mx-auto my-10 px-4">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Image */}
        <div className="w-full lg:w-1/2">
          <img
            src="/img/Photo.jpg"
            alt="Photo d'intégration"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>

        {/* Texte */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h3 className="text-2xl font-semibold mb-4">L'intégration, c'est quoi ?</h3>
          <p className="text-lg mb-6">
            C'est l'événement où l'ensemble des étudiants de l'UTT se mobilise pour concocter aux nouveaux (comme toi) une incroyable semaine durant laquelle tu découvriras la vie sur le campus, rencontreras une tonne de nouveaux amis et démarreras ta nouvelle vie d'étudiant ! Le tout se fait dans la bonne humeur et avec bienveillance, l'objectif c'est juste de s'amuser à fond !
          </p>

          <h3 className="text-2xl font-semibold mb-4">La petite histoire</h3>
          <p className="text-lg mb-6">
            Chaque année, deux factions composées d'une multitude d'équipes s'affrontent. Le thème de cette année : <strong>Passé vs Futur</strong>.
          </p>

          <h3 className="text-2xl font-semibold mb-4">Ce site, c'est quoi ?</h3>
          <p className="text-lg">
            C'est ici que tu trouveras toutes les informations nécessaires au déroulement de la semaine d'inté. Par exemple, tu pourras prendre ta place pour le WEI ou regarder quelle faction est la plus proche de la victoire.
          </p>
        </div>
      </div>
    </div>
  );
};
