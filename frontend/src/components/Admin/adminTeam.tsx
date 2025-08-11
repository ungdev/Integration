import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import Select from "react-select";

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
import { getUsersAdmin } from "../../services/requests/user.service";
import { Team } from "../../interfaces/team.interface";
import { Faction } from "../../interfaces/faction.interface";
import { User } from "../../interfaces/user.interface";
import Swal from "sweetalert2";

export const AdminTeamManagement = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [factions, setFactions] = useState<Faction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  const [editName, setEditName] = useState<string>("");
  const [editType, setEditType] = useState<string>("");
  const [editFactionId, setEditFactionId] = useState<number | null>(null);
  const [editLeaders, setEditLeaders] = useState<number[]>([]);
  const [editNewMembers, setEditNewMembers] = useState<number[]>([]);

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
        const members : [User] = await getTeamUsers(team.teamId);
        setEditName(team.name);
        setEditType(team.type);
        setEditFactionId(faction || null);
        setEditLeaders(members.filter(m => m.permission !== "Nouveau").map(m => m.userId));
        setEditNewMembers(members.filter(m => m.permission === "Nouveau").map(m => m.userId));
      }
    };
    loadTeamDetails();
  }, [selectedTeamId, teams]);

  const fetchData = async () => {
    try {
      const [teamRes, factionRes, usersRes] = await Promise.all([
        getAllTeams(),
        getAllFactionsAdmin(),
        getUsersAdmin(),
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
        teamMembers: [...editLeaders, ...editNewMembers],
        type: editType,
      });
      await Swal.fire("✅ Équipe mise à jour", "", "success");
      fetchData();
    } catch (err) {
      Swal.fire("❌ Erreur", "Erreur lors de la mise à jour", "error");
    }
  };

  const handleCreateTeam = async () => {
    if (teams.find((t) => t.name === newTeamName)) {
      Swal.fire("❌ Nom déjà utilisé", "Une équipe avec ce nom existe déjà", "warning");
      return;
    }
    if (!newTeamName) {
      Swal.fire("⚠️ Nom requis", "Veuillez renseigner un nom d'équipe", "info");
      return;
    }

    try {
      await createTeamLight({
        teamName: newTeamName,
        factionId: newFactionId,
      });
      await Swal.fire("✅ Équipe créée", "", "success");
      setNewTeamName("");
      setNewFactionId(null);
      fetchData();
    } catch (err) {
      Swal.fire("❌ Erreur", "Erreur lors de la création de l'équipe", "error");
    }
  };


  const handleDeleteConfirm = async () => {
    if (!selectedTeamId) return;

    const confirm = await Swal.fire({
      title: "🛑 Supprimer cette équipe ?",
      text: "Cette action est irréversible. Es-tu sûr(e) ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    });

    if (!confirm.isConfirmed) return;

    try {
      await deleteTeam(selectedTeamId);
      setTeams(teams.filter((t) => t.teamId !== selectedTeamId));
      setSelectedTeamId(null);
      await Swal.fire("✅ Équipe supprimée", "", "success");
    } catch (err) {
      Swal.fire("❌ Erreur", "Erreur lors de la suppression", "error");
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
              <h3 className="text-md font-semibold mb-2">👨‍💼 Chefs d’équipe</h3>
              <Select
                isMulti
                value={editLeaders.map((id) => {
                  const user = users.find((u) => u.userId === id);
                  return { value: id, label: user ? `${user.firstName} ${user.lastName}` : "" };
                })}
                onChange={(newValues: any) => {
                  const selectedIds = newValues.map((val: any) => val.value);
                  setEditLeaders(selectedIds);
                }}
                options={users
                  .filter((user) => user.permission !== "Nouveau")
                  .map((user) => ({
                    value: user.userId,
                    label: `${user.firstName} ${user.lastName}`,
                  }))}
                className="w-full"
                placeholder="Sélectionner les chefs"
              />
            </div>

            <div className="w-full md:w-96 pt-6">
              <h3 className="text-md font-semibold mb-2">🆕 Nouveaux membres</h3>
              <Select
                isMulti
                value={editNewMembers.map((id) => {
                  const user = users.find((u) => u.userId === id);
                  return { value: id, label: user ? `${user.firstName} ${user.lastName}` : "" };
                })}
                onChange={(newValues: any) => {
                  const selectedIds = newValues.map((val: any) => val.value);
                  setEditNewMembers(selectedIds);
                }}
                options={users
                  .filter((user) => user.permission === "Nouveau")
                  .map((user) => ({
                    value: user.userId,
                    label: `${user.firstName} ${user.lastName}`,
                  }))}
                className="w-full"
                placeholder="Sélectionner les nouveaux"
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button onClick={handleUpdate} className="bg-green-600 hover:bg-green-700 text-white">
                💾 Sauvegarder
              </Button>
              <Button onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white">
                🗑️ Supprimer
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export const DistributeTeam = () => {
  const handleConfirmDistribution = async () => {
    const confirm = await Swal.fire({
      title: "⚠️ Confirmation",
      text: "Cette action va affecter tous les utilisateurs sans équipe. Souhaitez-vous vraiment continuer ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await teamDistribution();
      await Swal.fire("✅ Répartition effectuée", response.message, "success");
    } catch (error: any) {
      Swal.fire("❌ Erreur", error.response?.data?.message || "Une erreur est survenue", "error");
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
            onClick={handleConfirmDistribution}
          >
            🔁 Lancer la répartition
          </Button>
        </div>
      </Card>
    </div>
  );
};
