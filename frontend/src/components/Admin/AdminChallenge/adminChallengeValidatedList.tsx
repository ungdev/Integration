import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { getAllChallengesValidates, unvalidateChallenge } from "../../../services/requests/challenge.service";
import Swal from "sweetalert2";


export const AdminValidatedChallengesList = () => {
  const [validatedChallenges, setValidatedChallenges] = useState<any[]>([]);

  const fetchValidatedChallenges = async () => {
    try {
      const challenges = await getAllChallengesValidates();
      setValidatedChallenges(challenges);
    } catch {
      Swal.fire("Erreur", "Impossible de récupérer les challenges validés", "error");
    }
  };

  useEffect(() => {
    fetchValidatedChallenges();
  }, []);

  const handleUnvalidate = async (challengeId: number, factionId: number, teamId: number, userId: number) => {
    const confirm = await Swal.fire({
      title: "Confirmer la dévalidation ?",
      text: "Cette action retirera la validation du challenge.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Oui, dévalider",
      cancelButtonText: "Annuler",
    });

    if (!confirm.isConfirmed) return;

    try {
      const result = await unvalidateChallenge({ challengeId, factionId, teamId, userId });
      Swal.fire("Succès", result.message, "success");
      fetchValidatedChallenges();
    } catch {
      Swal.fire("Erreur", "❌ Une erreur est survenue lors de la dévalidation", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="card p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center">📋 Challenges validés</h2>

        {validatedChallenges.length === 0 ? (
          <p className="text-center text-gray-500">Aucun challenge validé pour le moment.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {validatedChallenges.map((challenge) => (
              <div key={challenge.challenge_id} className="flex flex-col space-y-4 p-4 border rounded-xl">
                <div className="flex justify-between items-start space-x-6">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg text-gray-900">{challenge.challenge_name}</h3>
                    <p className="text-gray-600">{challenge.challenge_categorie}</p>
                    <p className="text-gray-500 text-sm">{challenge.challenge_description}</p>
                  </div>

                  <div className="space-y-1 text-right">
                    <p className="text-gray-700">
                      <strong>Points :</strong> {challenge.points}
                    </p>
                    <p className="text-gray-500 text-sm">
                      <strong>Validé le :</strong>{" "}
                      {new Date(challenge.validated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-gray-800 font-semibold">Destinataire :</p>
                    <p className="text-black-600">{challenge.target_faction_name}</p>
                    <p className="text-gray-600">{challenge.target_team_name}</p>
                    <p className="text-gray-700">
                      {challenge.target_user_firstname} {challenge.target_user_lastname}
                    </p>
                  </div>

                  <Button
                    onClick={() =>
                      handleUnvalidate(
                        challenge.challenge_id,
                        challenge.target_faction_id,
                        challenge.target_team_id,
                        challenge.target_user_id
                      )
                    }
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded"
                  >
                    Invalider
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
