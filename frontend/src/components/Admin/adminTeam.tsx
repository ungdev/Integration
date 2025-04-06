import { useEffect, useState } from "react";
import { Button } from "../../styles/components/ui/button";
import { Input } from "../../styles/components/ui/input";
import Select from "react-select";  // Import de react-select
import {
  getAllTeams,
  getTeamUsers,
  updateTeam,
  deleteTeam,
  createTeamLight,
  teamDistribution,
} from "../../services/requests/team.service";
import { getAllFactions } from "src/services/requests/faction.service";
import { getUsers } from "src/services/requests/user.service";
import { Team } from "src/interfaces/team.interface";
import { Faction } from "src/interfaces/faction.interface";
import { User } from "src/interfaces/user.interface";
import { getTeamFaction } from "src/services/requests/team.service";

export const AdminTeamManagement = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [factions, setFactions] = useState<Faction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  // States pour modification
  const [editName, setEditName] = useState<string>("");
  const [editFactionId, setEditFactionId] = useState<number | null>(null);
  const [editMembers, setEditMembers] = useState<number[]>([]);

  const [newTeamName, setNewTeamName] = useState("");
  const [newFactionId, setNewFactionId] = useState<number | null>(null);

  const selectedTeam = teams.find((t) => t.teamId === selectedTeamId);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const loadTeamDetails = async () => {
      if (!selectedTeamId) return;
      const team = teams.find((t) => t.teamId === selectedTeamId);
      if (team) {
        const faction = team.faction_id ?? ((await getTeamFaction(team.teamId))?.factionId);
        
        const members = await getTeamUsers(team.teamId);

        setEditName(team.name);
        setEditFactionId(faction || null);
        setEditMembers(members.map((member: User) => member.userId));
      }
    };

    loadTeamDetails();
  }, [selectedTeamId, teams]);

  const fetchData = async () => {
    try {
      const [teamRes, factionRes, usersRes] = await Promise.all([
        getAllTeams(),
        getAllFactions(),
        getUsers(),
      ]);
      setTeams(teamRes);
      setFactions(factionRes);
      setUsers(usersRes);
    } catch (err) {
      console.error("Erreur lors du chargement des données", err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedTeamId) return;
    try {
      await updateTeam({
        teamID: selectedTeamId,
        teamName: editName,
        factionID: editFactionId,
        teamMembers: editMembers,
      });
      alert("Équipe mise à jour !");
      fetchData();
    } catch (err) {
      console.error("Erreur lors de la mise à jour", err);
    }
  };

  const handleDelete = async () => {
    if (!selectedTeamId) return;
    try {
      await deleteTeam(selectedTeamId);
      setTeams(teams.filter((t) => t.teamId !== selectedTeamId));
      setSelectedTeamId(null);
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
    }
  };

  const handleCreateTeam = async () => {

    if(teams.find((t)=> t.name === newTeamName)){
      alert("Une équipe avec ce nom existe déjà");
      return;
    }
    if (!newTeamName) {
      alert("Veuillez remplir le nom de l'équipe");
      return;
    }

    try {
      await createTeamLight({
        teamName: newTeamName,
        factionId: newFactionId,
      });
      alert("Équipe créée !");
      setNewTeamName("");
      setNewFactionId(null);
      fetchData();
    } catch (err) {
      console.error("Erreur lors de la création de l'équipe", err);
    }
  };

    // Gestion du changement de sélection dans react-select
  const handleMemberChange = (newValues: any) => {
    // Extraire les IDs des utilisateurs sélectionnés
    const selectedIds = newValues.map((val: any) => val.value);

    // Mettre à jour l'état des membres sélectionnés avec les nouveaux IDs
    setEditMembers(selectedIds);
  };

  return (
    <div className="space-y-8 mt-6">
      {/* Création */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Créer une équipe</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Nom de l'équipe"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="w-full md:w-64"
          />
          <Select
            onChange={(selectedOption: any) => setNewFactionId(selectedOption.value)}
            options={factions.map(faction => ({ value: faction.factionId, label: faction.name }))}
            className="w-full md:w-64"
            placeholder="Sélectionner une faction"
          />
          <Button onClick={handleCreateTeam}>Créer</Button>
        </div>
      </div>

      {/* Sélection d'une équipe */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Modifier une équipe</h2>
        <Select
          value={teams.find((team) => team.teamId === selectedTeamId) ? { value: selectedTeamId, label: teams.find((team) => team.teamId === selectedTeamId)?.name } : null}
          onChange={(selectedOption: any) => setSelectedTeamId(selectedOption.value)}
          options={teams.map((team) => ({ value: team.teamId, label: team.name }))}
          className="w-full md:w-96"
          placeholder="Sélectionner une équipe"
        />
      </div>

      {/* Formulaire de modification */}
      {selectedTeam && (
        <div className="space-y-6 border-t pt-6">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full md:w-96"
          />

          <Select
            value={factions.find(f => f.factionId === editFactionId) ? { value: editFactionId, label: factions.find(f => f.factionId === editFactionId)?.name } : null}
            onChange={(selectedOption: any) => setEditFactionId(selectedOption.value)}
            options={factions.map(faction => ({ value: faction.factionId, label: faction.name }))}
            className="w-full md:w-96"
            placeholder="Sélectionner une faction"
          />

          {/* Membres de l'équipe */}
          <div>
            <h3 className="font-semibold mb-2">Membres de l'équipe</h3>
            <Select
            isMulti
            value={editMembers.map((id) => {
              const user = users.find((u) => u.userId === id);
              return { value: id, label: user ? `${user.firstName} ${user.lastName}` : "" };
            })}
            onChange={handleMemberChange}
            options={users
              .filter((user) => !editMembers.includes(user.userId))  // Filtrer les utilisateurs déjà sélectionnés
              .map((user) => ({ value: user.userId, label: `${user.firstName} ${user.lastName}` }))}
            className="w-full md:w-96"
            placeholder="Sélectionner des membres"
          />
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={handleUpdate}>💾 Sauvegarder</Button>
            <Button onClick={handleDelete}>
              🗑️ Supprimer l'équipe
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};



export const DistributeTeam = () => {

  const Submit = async () => {
    const response = await teamDistribution();
    alert(response.message);
  };

  return (
    <div>
      <div className="input">
        <label>Voulez-vous répartir aléatoirement les nouveaux dans leurs équipes ? </label>
         <p><strong>(Effet que sur ceux qui n'ont toujours d'équipe)</strong></p>
      </div>
      
      <Button className="submit-button" onClick={Submit}>Distribuer</Button>
    </div>
  );
};