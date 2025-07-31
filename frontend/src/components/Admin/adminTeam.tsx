import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import Select from "react-select";
import { Dialog } from "@headlessui/react";

import {
  getAllTeams,
  getTeamUsers,
  updateTeam,
  deleteTeam,
  createTeamLight,
  teamDistribution,
  getTeamFaction,
} from "../../services/requests/team.service";
import { getAllFactionsAdmin } from "../../services/requests/faction.service";
import { getUsers } from "../../services/requests/user.service";
import { Team } from "../../interfaces/team.interface";
import { Faction } from "../../interfaces/faction.interface";
import { User } from "../../interfaces/user.interface";

export const AdminTeamManagement = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [factions, setFactions] = useState<Faction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  const [editName, setEditName] = useState<string>("");
  const [editType, setEditType] = useState<string>("");
  const [editFactionId, setEditFactionId] = useState<number | null>(null);
  const [editMembers, setEditMembers] = useState<number[]>([]);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const [newTeamName, setNewTeamName] = useState("");
  const [newFactionId, setNewFactionId] = useState<number | null>(null);

  const selectedTeam = teams.find((t) => t.teamId === selectedTeamId);

  const typeOptions = [
    { value: "TC", label: "TC" },
    { value: "RI", label: "RI" },
    { value: "MM", label: "MM" },
    { value: "Branch", label: "Branch" },
  ];

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
        setEditType(team.type);
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
        getAllFactionsAdmin(),
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
        type: editType,
      });
      alert("✅ Équipe mise à jour !");
      fetchData();
    } catch (err) {
      console.error("Erreur lors de la mise à jour", err);
    }
  };

  const handleCreateTeam = async () => {
    if (teams.find((t) => t.name === newTeamName)) {
      alert("❌ Une équipe avec ce nom existe déjà");
      return;
    }
    if (!newTeamName) {
      alert("Veuillez renseigner un nom d'équipe");
      return;
    }

    try {
      await createTeamLight({
        teamName: newTeamName,
        factionId: newFactionId,
      });
      alert("✅ Équipe créée !");
      setNewTeamName("");
      setNewFactionId(null);
      fetchData();
    } catch (err) {
      console.error("Erreur lors de la création de l'équipe", err);
    }
  };

  const handleMemberChange = (newValues: any) => {
    const selectedIds = newValues.map((val: any) => val.value);
    setEditMembers(selectedIds);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTeamId) return;
    try {
      await deleteTeam(selectedTeamId);
      setTeams(teams.filter((t) => t.teamId !== selectedTeamId));
      setSelectedTeamId(null);
      setIsConfirmingDelete(false);
      alert("✅ Équipe supprimée !");
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-10 space-y-10 max-w-5xl mx-auto">
      <Card className="w-full p-6 rounded-2xl shadow space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center">🎯 Créer une équipe</h2>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Input
            placeholder="Nom de l'équipe"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="w-full md:w-64"
          />
          <Select
            onChange={(selectedOption: any) => setNewFactionId(selectedOption.value)}
            options={factions.map(f => ({ value: f.factionId, label: f.name }))}
            className="w-full md:w-64"
            placeholder="Sélectionner une faction"
          />
          <Button onClick={handleCreateTeam} className="bg-green-600 hover:bg-green-700 text-white">
            ➕ Créer
          </Button>
        </div>
      </Card>

      <Card className="w-full p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center">🛠️ Modifier une équipe</h2>
        <Select
          value={selectedTeamId
            ? {
                value: selectedTeamId,
                label: teams.find((team) => team.teamId === selectedTeamId)?.name,
              }
            : null}
          onChange={(selectedOption: any) => setSelectedTeamId(selectedOption.value)}
          options={teams.map((team) => ({ value: team.teamId, label: team.name }))}
          className="w-full md:w-96 mx-auto"
          placeholder="Sélectionner une équipe"
        />
      </Card>

      {selectedTeam && (
        <Card className="w-full p-6 rounded-2xl shadow space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">✏️ Éditer l'équipe</h2>

          <div className="flex flex-col items-center space-y-4">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full md:w-96"
              placeholder="Nom de l’équipe"
            />
            <Select
              options={typeOptions}
              value={
                typeOptions.find(option => option.value === editType) ??
                { value: "", label: "Aucun type" }
              }
              onChange={(selectedOption) => setEditType(selectedOption?.value || "")}
              className="w-full md:w-96"
              placeholder="Type d'équipe"
            />
            <Select
              value={editFactionId
                ? {
                    value: editFactionId,
                    label: factions.find(f => f.factionId === editFactionId)?.name,
                  }
                : null}
              onChange={(selectedOption: any) => setEditFactionId(selectedOption.value)}
              options={factions.map(f => ({ value: f.factionId, label: f.name }))}
              className="w-full md:w-96"
              placeholder="Sélectionner une faction"
            />

            <div className="w-full md:w-96">
              <h3 className="text-md font-semibold mb-2">👥 Membres de l’équipe</h3>
              <Select
                isMulti
                value={editMembers.map((id) => {
                  const user = users.find((u) => u.userId === id);
                  return { value: id, label: user ? `${user.firstName} ${user.lastName}` : "" };
                })}
                onChange={handleMemberChange}
                options={users.map((user) => ({
                  value: user.userId,
                  label: `${user.firstName} ${user.lastName}`,
                }))}
                className="w-full"
                placeholder="Sélectionner des membres"
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button onClick={handleUpdate} className="bg-green-600 hover:bg-green-700 text-white">
                💾 Sauvegarder
              </Button>
              <Button onClick={() => setIsConfirmingDelete(true)} className="bg-red-600 hover:bg-red-700 text-white">
                🗑️ Supprimer
              </Button>
            </div>
          </div>
        </Card>
      )}

      {isConfirmingDelete && (
        <Dialog open={isConfirmingDelete} onClose={() => setIsConfirmingDelete(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
          <Card className="p-6 rounded-xl bg-white shadow-xl space-y-4 w-96">
            <h3 className="text-xl font-bold text-red-600 text-center">🛑 Confirmation de suppression</h3>
            <p className="text-gray-700 text-center">Es-tu sûr(e) de vouloir supprimer cette équipe ? Cette action est irréversible.</p>
            <div className="flex justify-center gap-4 pt-4">
              <Button onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white">
                ✅ Confirmer
              </Button>
              <Button onClick={() => setIsConfirmingDelete(false)} className="bg-gray-300 hover:bg-gray-400 text-black">
                ❌ Annuler
              </Button>
            </div>
          </Card>
        </Dialog>
      )}
    </div>
  );
};

export const DistributeTeam = () => {

  const [isConfirming, setIsConfirming] = useState(false);

  const ConfirmSubmit = async () => {
    try {
      const response = await teamDistribution();
      alert(response.message);
    } catch (error: any) {
      alert(error.response.data.message);
    } finally {
      setIsConfirming(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card className="w-full p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center">🔀 Répartition automatique</h2>
        <div className="text-center text-gray-700 space-y-1">
          <p>Voulez-vous répartir aléatoirement les nouveaux dans leurs équipes ?</p>
          <p className="text-sm text-gray-500 font-medium">
            (Effet uniquement sur ceux qui n'ont pas encore d'équipe)
          </p>
        </div>
        <div className="flex justify-center pt-2">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setIsConfirming(true)}
          >
            🔁 Lancer la répartition
          </Button>
        </div>
      </Card>

      {isConfirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <Card className="p-6 rounded-xl bg-white shadow-xl space-y-4 w-96">
            <h3 className="text-xl font-bold text-blue-600 text-center">⚠️ Confirmation</h3>
            <p className="text-gray-700 text-center">
              Cette action va affecter tous les utilisateurs sans équipe.<br />Souhaitez-vous vraiment continuer ?
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Button
                onClick={ConfirmSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                ✅ Confirmer
              </Button>
              <Button
                onClick={() => setIsConfirming(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black"
              >
                ❌ Annuler
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
