import { useEffect, useState } from "react";
import { Button } from "../../styles/components/ui/button";
import { Input } from "../../styles/components/ui/input";
import { Card } from "../../styles/components/ui/card";
import {
  getAllChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  validateChallenge,
  addPointsToFaction,
  getAllChallengesValidates,
  unvalidateChallenge,
} from "../../services/requests/challenge.service";
import { Challenge } from "../../interfaces/challenge.interface";
import Select from "react-select";
import { getAllTeams } from "../../services/requests/team.service";
import { getAllFactions } from "../../services/requests/faction.service";
import { getUsers } from "../../services/requests/user.service";
import { Team } from "../../interfaces/team.interface";
import { Faction } from "../../interfaces/faction.interface";
import { User } from "../../interfaces/user.interface";


export const AdminChallengeForm = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [newChallenge, setNewChallenge] = useState({ title: "", description: "", category: "", points: 0 });
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);

  const [showValidationFormForId, setShowValidationFormForId] = useState<number | null>(null);
  const [validationType, setValidationType] = useState<"user" | "team" | "faction" | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<number | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [factions, setFactions] = useState<Faction[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  type ValidationTarget = "user" | "team" | "faction";

  const typeOptions: { value: ValidationTarget; label: string }[] = [
    { value: "user", label: "Utilisateur" },
    { value: "team", label: "Équipe" },
    { value: "faction", label: "Faction" },
  ];

  useEffect(() => {
    fetchChallenges();
    fetchAllTargets();
  }, []);

  const fetchChallenges = async () => {
    try {
      const challengeList = await getAllChallenges();
      setChallenges(challengeList);
    } catch (err) {
      console.error("Erreur lors du chargement des challenges", err);
    }
  };

  const fetchAllTargets = async () => {
    try {
      const [teamRes, factionRes, userRes] = await Promise.all([
        getAllTeams(),
        getAllFactions(),
        getUsers(),
      ]);
      setTeams(teamRes);
      setFactions(factionRes);
      setUsers(userRes);
    } catch (err) {
      console.error("Erreur lors du chargement des cibles", err);
    }
  };


  const resetForm = () => {
    setNewChallenge({ title: "", description: "", category: "", points: 0 });
    setEditingChallenge(null);
  };

  const handleCreateChallenge = async () => {
    try {
      const response = await createChallenge(newChallenge);
      alert(response.message);
      fetchChallenges();
      resetForm();
    } catch (err) {
      console.error("Erreur lors de la création du challenge", err);
    }
  };

  const handleUpdateChallenge = async () => {
    if (!editingChallenge) return;
    try {
        const response = await updateChallenge({
        id: editingChallenge.id,
        title: newChallenge.title,
        description: newChallenge.description,
        category: newChallenge.category,
        points: newChallenge.points,
      });
      alert(response.message);
      fetchChallenges();
      resetForm();
    } catch (err) {
      console.error("Erreur lors de la mise à jour du challenge", err);
    }
  };

  const handleValidateChallenge = async () => {
    if (!showValidationFormForId || !validationType || !selectedTargetId) return;
    try {
        const response = await validateChallenge({
        challengeId: showValidationFormForId,
        type: validationType,
        targetId: selectedTargetId,
      });
      alert(response.message);
      setShowValidationFormForId(null);
      setValidationType(null);
      setSelectedTargetId(null);
      fetchChallenges();
    } catch (err) {
      console.error("Erreur lors de la validation du challenge", err);
    }
  };

  const handleDeleteChallenge = async (challengeId: number) => {
    try {
        const response = await deleteChallenge(challengeId);
      alert(response.message);
      fetchChallenges();
    } catch (err) {
      console.error("Erreur lors de la suppression du challenge", err);
    }
  };

  const handleEditClick = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setNewChallenge({
      title: challenge.title,
      description: challenge.description,
      category: challenge.category,
      points: challenge.points,
    });
  };

  return (
    <div className="flex flex-col items-center px-4 py-8 space-y-8 max-w-3xl mx-auto">
      <Card className="w-full p-6 rounded-2xl shadow-md space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          {editingChallenge ? "✏️ Modifier un Challenge" : "🛠️ Créer un Challenge"}
        </h2>

        <div className="space-y-4">
          <Input
            placeholder="Titre du challenge"
            value={newChallenge.title}
            onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
          />
          <Input
            placeholder="Description du challenge"
            value={newChallenge.description}
            onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
          />
          <Input
            placeholder="Catégorie"
            value={newChallenge.category}
            onChange={(e) => setNewChallenge({ ...newChallenge, category: e.target.value })}
          />
          <Input
            placeholder="Points"
            type="number"
            value={newChallenge.points}
            onChange={(e) => setNewChallenge({ ...newChallenge, points: Number(e.target.value) })}
          />
          {editingChallenge ? (
            <div className="flex gap-4">
              <Button onClick={handleUpdateChallenge} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                Mettre à jour
              </Button>
              <Button onClick={resetForm} className="bg-gray-400 hover:bg-gray-500 text-white">
                Annuler
              </Button>
            </div>
          ) : (
            <Button onClick={handleCreateChallenge} className="bg-green-600 hover:bg-green-700 text-white">
              Créer Challenge
            </Button>
          )}
        </div>
      </Card>

      <Card className="w-full p-6 rounded-2xl shadow-md">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">📜 Challenges existants</h3>
        <ul className="space-y-4">
          {challenges.map((challenge) => (
            <li key={challenge.id} className="bg-gray-100 py-4 px-6 rounded-xl border border-gray-300 shadow-sm space-y-2">
              <h4 className="font-semibold">{challenge.title}</h4>
              <p>{challenge.description}</p>
              <p className="text-sm text-gray-500">Catégorie : {challenge.category}</p>
              <p className="text-sm text-gray-500">Points : {challenge.points}</p>
              <div className="flex gap-2 mt-2">
              <Button onClick={() => setShowValidationFormForId(challenge.id)} className="bg-blue-600 hover:bg-blue-700 text-white">
                Valider
                </Button>
                <Button onClick={() => handleDeleteChallenge(challenge.id)} className="bg-red-600 hover:bg-red-700 text-white">
                  Supprimer
                </Button>
                <Button onClick={() => handleEditClick(challenge)} className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  Modifier
                </Button>
              </div>
              {showValidationFormForId && (
                <div className="mt-6 bg-white p-4 border rounded-xl shadow-inner space-y-4">
                    <h4 className="font-bold text-lg">✅ Valider le challenge</h4>

                    <Select
                        placeholder="Choisir le type de cible"
                        onChange={(option) => {
                            setValidationType(option?.value ?? null);
                            setSelectedTargetId(null); // reset
                        }}
                        options={typeOptions}
                    />

                    {validationType === "user" && (
                    <Select
                        placeholder="Sélectionner un utilisateur"
                        onChange={(option) => setSelectedTargetId(Number(option?.value))}
                        options={users.map((u) => ({
                        value: u.userId,
                        label: `${u.firstName} ${u.lastName}`,
                        }))}
                    />
                    )}

                    {validationType === "team" && (
                    <Select
                        placeholder="Sélectionner une équipe"
                        onChange={(option) => setSelectedTargetId(Number(option?.value))}
                        options={teams.map((t) => ({
                        value: t.teamId,
                        label: t.name,
                        }))}
                    />
                    )}

                    {validationType === "faction" && (
                    <Select
                        placeholder="Sélectionner une faction"
                        onChange={(option) => setSelectedTargetId(Number(option?.value))}
                        options={factions.map((f) => ({
                        value: f.factionId,
                        label: f.name,
                        }))}
                    />
                    )}

                    <div className="flex gap-4">
                    <Button onClick={handleValidateChallenge} className="bg-blue-600 hover:bg-blue-700 text-white">
                        ✅ Valider
                    </Button>
                    <Button
                        onClick={() => {
                        setShowValidationFormForId(null);
                        setValidationType(null);
                        setSelectedTargetId(null);
                        }}
                        className="bg-gray-400 hover:bg-gray-500 text-white"
                    >
                        ❌ Annuler
                    </Button>
                    </div>
                </div>
            )}
            </li>
          ))
          }
        </ul>
        
      </Card>
    </div>
  );
};

/*===========================================================================================================*/

export const AdminChallengeAddPointsForm = () => {
    const [factions, setFactions] = useState<Faction[]>([]);  // Type explicite pour factions
    const [title, setTitle] = useState("");
    const [factionId, setFactionId] = useState<number | null>(null);
    const [points, setPoints] = useState<number | string>("");
    const [reason, setReason] = useState("");
  
    useEffect(() => {
      const fetchFactions = async () => {
        try {
          const response = await getAllFactions();
          setFactions(response);
        } catch (error) {
          console.error("Erreur lors de la récupération des factions", error);
        }
      };
  
      fetchFactions();
    }, []);
  
    const handleSubmit = async () => {
      if (!title || !factionId || !points || !reason) {
        alert("Tous les champs doivent être remplis.");
        return;
      }
  
      // Assurez-vous que points est un nombre
      const pointsNumber = Number(points);
      if (isNaN(pointsNumber)) {
        alert("Veuillez entrer un nombre valide pour les points.");
        return;
      }
  
      try {
        const result = await addPointsToFaction({
          title,
          factionId,
          points: pointsNumber,
          reason,
        });
        alert(result.message);
        // Réinitialiser le formulaire après soumission
        setTitle("");
        setFactionId(null);
        setPoints("");
        setReason("");
      } catch (error) {
        alert("❌ Une erreur est survenue lors de l'ajout des points.");
        console.error(error);
      }
    };
  
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="card p-6 rounded-2xl shadow space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 text-center">🎯 Ajouter des points à une faction</h2>
          
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du challenge"
          />
  
          <Select
            value={
              factionId
                ? { 
                    value: factionId, 
                    label: factions.find((f) => f.factionId === factionId)?.name || 'Faction non trouvée'
                  }
                : null
            }
            onChange={(option) => setFactionId(option ? option.value : null)}
            options={factions.map((f) => ({ value: f.factionId, label: f.name }))}
            placeholder="Sélectionner une faction"
          />
  
          <Input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder="Nombre de points"
          />
  
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Raison"
          />
  
          <div className="flex justify-center pt-4">
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
              Ajouter les points
            </Button>
          </div>
        </div>
      </div>
    );
};

/*===========================================================================================================*/

export const AdminValidatedChallengesList = () => {
    const [validatedChallenges, setValidatedChallenges] = useState<any[]>([]);
  
    useEffect(() => {

      fetchValidatedChallenges();
    }, []);
  
    const fetchValidatedChallenges = async () => {
        try {
          const challenges = await getAllChallengesValidates();
          setValidatedChallenges(challenges);
        } catch (error) {
          console.error("Erreur lors de la récupération des challenges validés", error);
        }
    };

    const handleUnvalidate = async (challengeId: number, factionId: number, teamId: number, userId: number) => {
      try {
        const result = await unvalidateChallenge({ challengeId, factionId, teamId, userId });
        alert(result.message);
        fetchValidatedChallenges();
      } catch (error) {
        alert("❌ Une erreur est survenue lors de la désvalidation.");
        console.error(error);
      }
    };
  
    return (
        <div className="max-w-3xl mx-auto mt-8">
  <div className="card p-6 rounded-2xl shadow space-y-4">
    <h2 className="text-2xl font-bold text-gray-800 text-center">📋 Challenges validés</h2>

    {validatedChallenges.length === 0 ? (
      <p className="text-center text-gray-500">Aucun challenge validé pour le moment.</p>
    ) : (
      <div className="space-y-6">
        {validatedChallenges.map((challenge) => (
          <div key={challenge.challenge_id} className="flex flex-col space-y-4 p-4 border-b">
            <div className="flex justify-between items-start space-x-6">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg text-gray-900">{challenge.challenge_name}</h3>
                <p className="text-gray-600">{challenge.challenge_categorie}</p>
                <p className="text-gray-500 text-sm">{challenge.challenge_description}</p>
              </div>

              <div className="space-y-1">
                <p className="text-gray-700"><strong>Points :</strong> {challenge.points}</p>
                <p className="text-gray-500 text-sm"><strong>Validé le :</strong> {new Date(challenge.validated_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-gray-800"><strong>Destinataire :</strong></p>
                <p className="text-black-600"><strong>{challenge.target_faction_name}</strong></p>
                <p className="text-gray-600">{challenge.target_team_name}</p>
                <p className="text-gray-700">{challenge.target_user_firstname} {challenge.target_user_lastname}</p>
              </div>

              <Button
                onClick={() => handleUnvalidate(
                  challenge.challenge_id, 
                  challenge.target_faction_id, 
                  challenge.target_team_id,
                  challenge.target_user_id)}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded"
              >
                Unvalider
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