export const ParrainageNewStudent = () => {
  return (
    <section className="w-full bg-white text-gray-800 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-blue-700">
          Tu vas intégrer l'UTT ?
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-10">
          Tu souhaites être accompagné par un étudiant pour découvrir ta nouvelle école ? Remplis vite ce formulaire !
        </p>

        <div className="relative pb-[56.25%] rounded-xl shadow-lg overflow-hidden">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLScThti-8I0ceHVb8RBYPzLcGhXNo2KPMg_nQHshrb6hC8EG_w/viewform?embedded=true"
            className="absolute inset-0 w-full h-full border-none"
            title="Formulaire Parrainage Nouvel Étudiant"
            loading="lazy"
          >
            Chargement…
          </iframe>
        </div>
      </div>
    </section>
  );
};

export const ParrainageStudent = () => {
  return (
    <section className="w-full bg-white text-gray-800 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-blue-700">
          Tu veux devenir parrain/marraine à l'UTT ?
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-10">
          Remplis ce formulaire pour accompagner un nouvel étudiant et lui faire découvrir la vie UTTienne !
        </p>

        <div className="relative pb-[56.25%] rounded-xl shadow-lg overflow-hidden">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLScM8LTorRrysnWNGKAX31Snqo2QQz02032m-CK7lUA0MpBaQQ/viewform?embedded=true"
            className="absolute inset-0 w-full h-full border-none"
            title="Formulaire Parrainage Étudiant Actuel"
            loading="lazy"
          >
            Chargement…
          </iframe>
        </div>
      </div>
    </section>
  );
};
