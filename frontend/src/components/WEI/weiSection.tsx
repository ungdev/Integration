import { useEffect } from "react";

export const WeiSection = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.billetweb.fr/js/export.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <section className="w-full min-h-screen bg-gradient-to-br py-12 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            🎉 Tu es nouveau ? Participe au WEI !
          </h2>
          <p className="text-lg md:text-xl text-gray-700">
            Un événement incroyable t’attend… Inscris-toi dès maintenant pour ne rien rater du Week-End d’Intégration 2025 !
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <iframe
            title="Billetterie WEI"
            src="https://www.billetweb.fr/shop.php?event=billetterie-week-end-dintegration-2024"
            className="w-full h-[600px] border-none"
          />
        </div>
      </div>
    </section>
  );
};
