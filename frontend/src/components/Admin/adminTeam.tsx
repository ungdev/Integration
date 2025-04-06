import { useEffect, useState } from "react";
import { Button } from "../../styles/components/ui/button";
import { Input } from "../../styles/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../styles/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../styles/components/ui/card";
import {
  getAllTeams,
  getTeamUsers,
  updateTeam,
  deleteTeam,
  createTeamLight,
} from "../../services/requests/team.service";
import { getAllFactions } from "src/services/requests/faction.service";
import { getUsers } from "src/services/requests/user.service";
import { Team } from "src/interfaces/team.interface";
import { Faction } from "src/interfaces/faction.interface";
import { User } from "src/interfaces/user.interface";

export const AdminTeamManagement = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [factions, setFactions] = useState<Faction[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [newFactionId, setNewFactionId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamRes, factionRes, usersRes] = await Promise.all([
        getAllTeams(),
        getAllFactions(),
        getUsers(),
      ]);
      const enrichedTeams = await Promise.all(
        teamRes.map(async (team: Team) => {
          const members = await getTeamUsers(team.teamId);
          return { ...team, members };
        })
      );
      setTeams(enrichedTeams);
      setFactions(factionRes);
      setUsers(usersRes);
    } catch (err) {
      console.error("Erreur lors du chargement des données", err);
    }
  };

  const handleUpdate = async (team: any) => {
    try {
      const payload = {
        teamID: team.teamId,
        teamName: team.name,
        teamMembers: team.members.map((m: User) => m.userId),
        factionID: team.faction_id,
      };
      await updateTeam(payload);
      alert("Équipe mise à jour !");
    } catch (err) {
      console.error("Erreur lors de la mise à jour", err);
    }
  };

  const handleDelete = async (teamId: number) => {
    try {
      await deleteTeam(teamId);
      setTeams(teams.filter((t) => t.teamId !== teamId));
    } catch (err) {
      console.error("Erreur lors de la suppression", err);
    }
  };

  const handleCreateTeam = async () => {
    if (!newTeamName || !newFactionId) {
      alert("Veuillez remplir tous les champs.");
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

  const toggleMember = (team: any, user: User) => {
    const alreadyMember = team.members.find((m: User) => m.userId === user.userId);
    if (alreadyMember) {
      team.members = team.members.filter((m: User) => m.userId !== user.userId);
    } else {
      team.members.push(user);
    }
    setTeams([...teams]);
  };

  const isMember = (team: any, userId: number) => {
    return team.members.some((u: any) => u.id === userId);
  };

  return (
    <Card className="p-6 shadow-lg mt-6 w-full">
      <CardHeader>
        <CardTitle>Gestion des Équipes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">

        {/* Création */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Créer une nouvelle équipe</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Nom de l'équipe"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="w-full md:w-64"
            />
            <Select
              value={newFactionId?.toString() || ""}
              onValueChange={(val) => setNewFactionId(parseInt(val))}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sélectionner une faction" />
              </SelectTrigger>
              <SelectContent>
                {factions.map((faction) => (
                  <SelectItem key={faction.factionId} value={faction.factionId.toString()}>
                    {faction.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleCreateTeam}>Créer</Button>
          </div>
        </div>

        {/* Liste des équipes */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Équipes existantes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.map((team) => (
              <div key={team.id} className="border p-4 rounded-lg shadow space-y-4 bg-white">
                <Input
                  value={team.name}
                  onChange={(e) => (team.name = e.target.value)}
                  className="w-full"
                />
                <Select
                  value={team.faction_id?.toString() || ""}
                  onValueChange={(val) => (team.faction_id = parseInt(val))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Faction" />
                  </SelectTrigger>
                  <SelectContent>
                    {factions.map((faction) => (
                      <SelectItem key={faction.factionId} value={faction.factionId.toString()}>
                        {faction.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-600">Membres actuels :</div>
                <div className="flex flex-wrap gap-2">
                  {team.members.length > 0 ? (
                    team.members.map((member: User) => (
                      <div
                        key={member.userId}
                        className="bg-green-100 text-green-900 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                      >
                        {member.lastName}" "{member.firstName}
                        <button
                          className="text-red-500 font-bold"
                          onClick={() => toggleMember(team, member)}
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-400">Aucun membre</div>
                  )}
                </div>

                <div className="text-sm font-semibold text-gray-600">Ajouter un membre :</div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {users
                    .filter((user) => !isMember(team, user.userId))
                    .map((user) => (
                      <button
                        key={user.userId}
                        className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm"
                        onClick={() => toggleMember(team, user)}
                      >
                        ➕ {user.lastName}" "{user.firstName}
                      </button>
                    ))}
                </div>
              </div>


                <div className="flex justify-end gap-2 pt-2">
                  <Button onClick={() => handleUpdate(team)}>💾 Sauvegarder</Button>
                  <Button variant="destructive" onClick={() => handleDelete(team.teamId)}>
                    🗑️ Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
