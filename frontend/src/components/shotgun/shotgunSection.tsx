import { useState, useEffect } from "react";
import { checkShotgunStatus, attemptShotgun } from "../../services/requests/event.service";
import { Button } from "../../styles/components/ui/button";
import { Input } from "../../styles/components/ui/input";

export const Shotgun = () => {
  const [status, setStatus] = useState(false); // Statut du shotgun
  const [teamId, setTeamId] = useState(""); // ID de l'équipe (si nécessaire pour l'enregistrement)
  const [message, setMessage] = useState(""); // Message de retour
  const [inputValue, setInputValue] = useState(""); // Valeur de l'entrée de l'utilisateur
  
  // Phrase ou mot prédéfini pour réussir le Shotgun
  const predefinedShotgunPhrase = "ShotgunPhrase"; // Remplacez par votre mot ou phrase de votre choix

  useEffect(() => {
    const fetchStatus = async () => {
      const shotgun_open = await checkShotgunStatus();
      setStatus(shotgun_open);
    };
    fetchStatus();
  }, []);

  const handleShotgun = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifiez si l'entrée de l'utilisateur correspond à la phrase prédéfinie
    if (inputValue !== predefinedShotgunPhrase) {
      setMessage("Erreur : Phrase de Shotgun incorrecte.");
      return;
    }

    // Si la phrase est correcte, effectuez l'action de Shotgun
    try {
      const response = await attemptShotgun();
      setMessage(`Shotgun validé !`);
    } catch (error : any) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Shotgun CE - Entre le mot : <span className="text-blue-700">{predefinedShotgunPhrase}</span></h2>
      {status ? (
        <form onSubmit={handleShotgun} className="space-y-4">
          <Input 
            type="text" 
            placeholder="Entrez la phrase de Shotgun" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
          <Button type="submit" className="w-full py-3 text-lg bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300">
            Shotgun !
          </Button>
          {message && (
            <p className={`text-center text-lg ${message.includes("Erreur") ? "text-red-500" : "text-green-600"}`}>
              {message}
            </p>
          )}
        </form>
      ) : (
        <p className="text-center text-red-600 text-lg">Le shotgun n'est pas encore ouvert.</p>
      )}
    </div>
  );
};
