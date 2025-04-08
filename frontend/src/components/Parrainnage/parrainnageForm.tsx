export const ParrainageNewStudent = () => {
    return (
      <div className="container-parrainage bg-gray-50 min-h-screen flex flex-col justify-center items-center py-12">
        <div className="header-parrainage text-center mb-8 px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Tu vas intégrer l'UTT et tu souhaites être accompagné par un étudiant pour connaître encore mieux ta nouvelle école ?
          </h3>
          <h3 className="text-lg text-gray-600">
            Alors remplis ce formulaire sans plus attendre !
          </h3>
        </div>
        <div className="iframe-container-parrainage w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="relative pb-[56.25%]"> {/* Aspect Ratio: 16:9 */}
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLScRSe2IMVGRA9jMhifQTJiGWbyPJIh6f5g-Spzel9dwhGmMFA/viewform?embedded=true"
              className="absolute inset-0 w-full h-full border-none rounded-lg"
              title="Formulaire de parrainage"
              loading="lazy"
            >
              Chargement…
            </iframe>
          </div>
        </div>
      </div>
    );
};
  
export const ParrainageStudent = () => {
    return (
      <div className="container-parrainage bg-gray-50 min-h-screen flex flex-col justify-center items-center py-12">
        <div className="header-parrainage text-center mb-8 px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Tu vas intégrer l'UTT et tu souhaites être accompagné par un étudiant pour connaître encore mieux ta nouvelle école ?
          </h3>
          <h3 className="text-lg text-gray-600">
            Alors remplis ce formulaire sans plus attendre !
          </h3>
        </div>
        <div className="iframe-container-parrainage w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="relative pb-[56.25%]"> {/* Aspect Ratio: 16:9 */}
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLScNenNR2mnFXLj9SHkZSGvPlC7u0eH6o9i97Vv30M_BqXGhiQ/viewform?embedded=true  "
              className="absolute inset-0 w-full h-full border-none rounded-lg"
              title="Formulaire de parrainage"
              loading="lazy"
            >
              Chargement…
            </iframe>
          </div>
        </div>
      </div>
    );
  };