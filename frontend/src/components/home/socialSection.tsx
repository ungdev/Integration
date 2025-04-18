// src/components/SocialLinks.tsx
export const SocialLinks = () => {
  return (
    <div className="container mx-auto my-10 px-4">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-6">Rejoins-nous sur les réseaux</h3>
        <p className="text-lg mb-6">
          Reste connecté(e) et découvre tout ce qui se passe pendant la semaine d'intégration et bien plus encore !
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {/* Facebook */}
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-800 transition"
          >
            Facebook
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-800 transition"
          >
            Instagram
          </a>

          {/* Twitter */}
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-blue-400 text-white rounded-full hover:bg-blue-600 transition"
          >
            Twitter
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 bg-blue-700 text-white rounded-full hover:bg-blue-900 transition"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};
