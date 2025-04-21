import { useState, useEffect } from "react";
import { checkShotgunStatus, attemptShotgun } from "../../services/requests/event.service";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const Shotgun = () => {
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [inputValue, setInputValue] = useState("");

  const predefinedShotgunPhrase = "Scooby"; // Tu peux personnaliser ça évidemment !

  useEffect(() => {
    const fetchStatus = async () => {
      const shotgun_open = await checkShotgunStatus();
      setStatus(shotgun_open);
    };
    fetchStatus();
  }, []);

  const handleShotgun = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputValue !== predefinedShotgunPhrase) {
      setMessage("❌ Erreur : Phrase de Shotgun incorrecte.");
      return;
    }

    try {
      const response = await attemptShotgun();
      setMessage(response.message);
    } catch (error: any) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300 rounded-lg shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-gray-800">
        Shotgun 🎯
      </h2>

      <p className="text-center text-sm sm:text-base text-gray-700 mb-6">
        Tape exactement la bonne phrase pour valider ton shotgun (majuscules incluses).
      </p>

      <div className="text-center mb-6">
        <p className="text-lg sm:text-xl font-semibold text-purple-800">
          Mot à entrer :{" "}
          <span className={`font-bold ${status ? "text-purple-900" : "blur-sm text-purple-600 select-none"}`}>
            {predefinedShotgunPhrase}
          </span>
        </p>
        {!status && (
          <p className="text-sm mt-1 italic text-gray-600">
            (Il sera révélé lorsque le shotgun sera ouvert)
          </p>
        )}
      </div>

      {status ? (
        <form onSubmit={handleShotgun} className="space-y-6">
          <Input
            type="text"
            placeholder="Entrez la phrase exacte"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition duration-300"
          />
          <Button
            type="submit"
            className="w-full py-3 text-lg bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
          >
            Shotgun !
          </Button>
          {message && (
            <p
              className={`text-center text-lg mt-4 ${
                message.includes("Erreur") || message.toLowerCase().includes("déjà")
                  ? "text-red-500"
                  : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      ) : (
        <p className="text-center text-red-600 text-lg font-medium">
          Le shotgun n'est pas encore ouvert.
        </p>
      )}
    </div>
  );
};
