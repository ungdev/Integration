import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';

import { type Faction } from '../../interfaces/faction.interface';
import { type Team } from '../../interfaces/team.interface';
import { type User } from '../../interfaces/user.interface';
import { getAllFactionsAdmin } from '../../services/requests/faction.service';
import {
    createTeamLight,
    deleteTeam,
    getAllTeams,
    getTeamFaction,
    getTeamUsers,
    teamDistribution,
    updateTeam,
} from '../../services/requests/team.service';
import { getUsersAdmin } from '../../services/requests/user.service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';

export const AdminTeamManagement = () => {
    const [searchParams] = useSearchParams();
    const [teams, setTeams] = useState<Team[]>([]);
    const [factions, setFactions] = useState<Faction[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

    const [editName, setEditName] = useState<string>('');
    const [editType, setEditType] = useState<string>('');
    const [editFactionId, setEditFactionId] = useState<number | null>(null);
    const [editLeaders, setEditLeaders] = useState<number[]>([]);
    const [editNewMembers, setEditNewMembers] = useState<number[]>([]);

    const [newTeamName, setNewTeamName] = useState('');
    const [newFactionId, setNewFactionId] = useState<number | null>(null);

    const selectedTeam = teams.find((t) => t.teamId === selectedTeamId);

    const typeOptions = [
        { value: 'TC', label: 'TC' },
        { value: 'RI', label: 'RI' },
        { value: 'MM', label: 'MM' },
        { value: 'Branch', label: 'Branch' },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const teamIdParam = searchParams.get('teamId');
        if (!teamIdParam) {
            return;
        }

        const parsedId = Number(teamIdParam);
        if (!Number.isNaN(parsedId)) {
            setSelectedTeamId(parsedId);
        }
    }, [searchParams]);

    useEffect(() => {
        const loadTeamDetails = async () => {
            if (!selectedTeamId) return;
            const team = teams.find((t) => t.teamId === selectedTeamId);
            if (team) {
                const faction = team.faction_id ?? (await getTeamFaction(team.teamId))?.factionId;
                const members: [User] = await getTeamUsers(team.teamId);
                setEditName(team.name);
                setEditType(team.type);
                setEditFactionId(faction || null);
                setEditLeaders(members.filter((m) => m.permission !== 'Nouveau').map((m) => m.userId));
                setEditNewMembers(members.filter((m) => m.permission === 'Nouveau').map((m) => m.userId));
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
            console.error('Erreur lors du chargement des données', err);
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
            await Swal.fire('✅ Équipe mise à jour', '', 'success');
            fetchData();
        } catch {
            Swal.fire('❌ Erreur', 'Erreur lors de la mise à jour', 'error');
        }
    };

    const handleCreateTeam = async () => {
        if (teams.find((t) => t.name === newTeamName)) {
            Swal.fire('❌ Nom déjà utilisé', 'Une équipe avec ce nom existe déjà', 'warning');
            return;
        }
        if (!newTeamName) {
            Swal.fire('⚠️ Nom requis', "Veuillez renseigner un nom d'équipe", 'info');
            return;
        }

        try {
            await createTeamLight({
                teamName: newTeamName,
                factionId: newFactionId,
            });
            await Swal.fire('✅ Équipe créée', '', 'success');
            setNewTeamName('');
            setNewFactionId(null);
            fetchData();
        } catch {
            Swal.fire('❌ Erreur', "Erreur lors de la création de l'équipe", 'error');
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedTeamId) return;

        const confirm = await Swal.fire({
            title: '🛑 Supprimer cette équipe ?',
            text: 'Cette action est irréversible. Es-tu sûr(e) ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
        });

        if (!confirm.isConfirmed) return;

        try {
            await deleteTeam(selectedTeamId);
            setTeams(teams.filter((t) => t.teamId !== selectedTeamId));
            setSelectedTeamId(null);
            await Swal.fire('✅ Équipe supprimée', '', 'success');
        } catch {
            Swal.fire('❌ Erreur', 'Erreur lors de la suppression', 'error');
        }
    };

    return (
        <div className="flex flex-col items-center px-4 py-5 space-y-10">
            <Card className="w-full max-w-7xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                        🎯 Créer une équipe
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center gap-4 mx-auto">
                        <Input
                            placeholder="Nom de l'équipe"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            className="w-full md:w-64"
                        />
                        <Select
                            onChange={(selectedOption: any) => setNewFactionId(selectedOption.value)}
                            options={factions.map((f) => ({ value: f.factionId, label: f.name }))}
                            className="w-full md:w-64"
                            placeholder="Sélectionner une faction"
                        />
                        <Button onClick={handleCreateTeam} className="bg-green-600 hover:bg-green-700 text-white">
                            ➕ Créer
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full max-w-7xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                        🛠️ Modifier une équipe
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Select
                        value={
                            selectedTeamId
                                ? {
                                      value: selectedTeamId,
                                      label: teams.find((team) => team.teamId === selectedTeamId)?.name,
                                  }
                                : null
                        }
                        onChange={(selectedOption: any) => setSelectedTeamId(selectedOption.value)}
                        options={teams.map((team) => ({ value: team.teamId, label: team.name }))}
                        className="w-full md:w-96 mx-auto"
                        placeholder="Sélectionner une équipe"
                    />
                </CardContent>
            </Card>

            {selectedTeam && (
                <Card className="w-full max-w-7xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                            ✏️ Éditer l'équipe
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full md:w-96 mx-auto"
                            placeholder="Nom de l'équipe"
                        />
                        <Select
                            options={typeOptions}
                            value={
                                typeOptions.find((option) => option.value === editType) ?? {
                                    value: '',
                                    label: 'Aucun type',
                                }
                            }
                            onChange={(selectedOption) => setEditType(selectedOption?.value || '')}
                            className="w-full md:w-96 mx-auto"
                            placeholder="Type d'équipe"
                        />
                        <Select
                            value={
                                editFactionId
                                    ? {
                                          value: editFactionId,
                                          label: factions.find((f) => f.factionId === editFactionId)?.name,
                                      }
                                    : null
                            }
                            onChange={(selectedOption: any) => setEditFactionId(selectedOption.value)}
                            options={factions.map((f) => ({ value: f.factionId, label: f.name }))}
                            className="w-full md:w-96 mx-auto"
                            placeholder="Sélectionner une faction"
                        />

                        <div className="w-full md:w-96 mx-auto">
                            <h3 className="text-md font-semibold mb-2">👨‍💼 Chefs d'équipe</h3>
                            <Select
                                isMulti
                                value={editLeaders.map((id) => {
                                    const user = users.find((u) => u.userId === id);
                                    return { value: id, label: user ? `${user.firstName} ${user.lastName}` : '' };
                                })}
                                onChange={(newValues: any) => {
                                    const selectedIds = newValues.map((val: any) => val.value);
                                    setEditLeaders(selectedIds);
                                }}
                                options={users
                                    .filter((user) => user.permission !== 'Nouveau')
                                    .map((user) => ({
                                        value: user.userId,
                                        label: `${user.firstName} ${user.lastName}`,
                                    }))}
                                className="w-full"
                                placeholder="Sélectionner les chefs"
                            />
                        </div>

                        <div className="w-full md:w-96 pt-6 mx-auto">
                            <h3 className="text-md font-semibold mb-2">🆕 Nouveaux membres</h3>
                            <Select
                                isMulti
                                value={editNewMembers.map((id) => {
                                    const user = users.find((u) => u.userId === id);
                                    return { value: id, label: user ? `${user.firstName} ${user.lastName}` : '' };
                                })}
                                onChange={(newValues: any) => {
                                    const selectedIds = newValues.map((val: any) => val.value);
                                    setEditNewMembers(selectedIds);
                                }}
                                options={users
                                    .filter((user) => user.permission === 'Nouveau')
                                    .map((user) => ({
                                        value: user.userId,
                                        label: `${user.firstName} ${user.lastName}`,
                                    }))}
                                className="w-full"
                                placeholder="Sélectionner les nouveaux"
                            />
                        </div>

                        <div className="flex flex-wrap justify-around gap-4 pt-4 mx-auto w-full md:w-96">
                            <Button onClick={handleUpdate} className="bg-green-600 hover:bg-green-700 text-white">
                                💾 Sauvegarder
                            </Button>
                            <Button onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white">
                                🗑️ Supprimer
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export const DistributeTeam = () => {
    const handleConfirmDistribution = async () => {
        const confirm = await Swal.fire({
            title: '⚠️ Confirmation',
            text: 'Cette action va affecter tous les utilisateurs sans équipe. Souhaitez-vous vraiment continuer ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui',
            cancelButtonText: 'Non',
        });

        if (!confirm.isConfirmed) return;

        try {
            const response = await teamDistribution();
            await Swal.fire('✅ Répartition effectuée', response.message, 'success');
        } catch (error: any) {
            Swal.fire('❌ Erreur', error.response?.data?.message || 'Une erreur est survenue', 'error');
        }
    };

    return (
        <Card className="w-full max-w-7xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    🔀 Répartition automatique
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center text-gray-700 space-y-1">
                    <p>Voulez-vous répartir aléatoirement les nouveaux dans leurs équipes ?</p>
                    <p className="text-sm text-gray-500 font-medium">
                        (Effet uniquement sur ceux qui n'ont pas encore d'équipe)
                    </p>
                </div>
                <div className="flex justify-center pt-2">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleConfirmDistribution}>
                        🔁 Lancer la répartition
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
