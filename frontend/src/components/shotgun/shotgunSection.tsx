import { useState, useEffect } from "react";
import { checkShotgunStatus, attemptShotgun } from "../../services/requests/event.service";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const Shotgun = () => {
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [inputValue, setInputValue] = useState("");

  const predefinedShotgunPhrase = "siropdekiwi"; // Tu peux personnaliser ça évidemment !

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
    <Card className="w-full max-w-3xl mx-auto bg-gradient-to-br from-yellow-100 to-orange-200">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
          Shotgun 🎯
        </CardTitle>
        <p className="text-lg md:text-xl text-gray-700 text-center">
          Tape exactement la bonne phrase pour valider ton shotgun (majuscules incluses).
        </p>
      </CardHeader>
      <CardContent className="space-y-10">
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
              className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 transition duration-300 bg-white"
            />
            <Button
              type="submit"
              className="w-full py-3 text-lg bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
            >
              Shotgun !
            </Button>
            {message && (
              <p
                className={`text-center text-lg mt-4 ${message.includes("Erreur") || message.toLowerCase().includes("déjà")
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
            🚫 Le shotgun n'est pas encore ouvert.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
