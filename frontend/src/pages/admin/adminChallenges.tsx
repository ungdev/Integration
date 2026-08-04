import { useEffect, useRef, useState } from 'react';

import AdminChallengeList from '../../components/Admin/AdminChallenge/adminChalengeList';
import { AdminChallengeAddPointsForm } from '../../components/Admin/AdminChallenge/adminChallengeAddPointsForm';
import ChallengeEditor from '../../components/Admin/AdminChallenge/adminChallengeEditor';
import { AdminValidatedChallengesList } from '../../components/Admin/AdminChallenge/adminChallengeValidatedList';
import { AdminLayout } from '../../components/Admin/adminLayout';
import { RevealSection } from '../../components/ui/revealSection';
import { type Challenge, type ValidatedChallenge } from '../../interfaces/challenge.interface';
import { type Faction } from '../../interfaces/faction.interface';
import { type Team } from '../../interfaces/team.interface';
import { type User } from '../../interfaces/user.interface';
import { getAllChallenges, getAllChallengesValidates } from '../../services/requests/challenge.service';
import { getAllFactionsUser } from '../../services/requests/faction.service';
import { getAllTeams } from '../../services/requests/team.service';
import { getUsers } from '../../services/requests/user.service';

const AdminPageChallenges: React.FC = () => {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [validatedChallenges, setValidatedChallenges] = useState<ValidatedChallenge[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [factions, setFactions] = useState<Faction[]>([]);
    const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
    const editorRef = useRef<HTMLDivElement>(null);

    const fetchChallengesUsersTeamsFactions = async () => {
        try {
            const challsRes = await getAllChallenges();
            const usersRes = await getUsers();
            const teamsRes = await getAllTeams();
            const factionsRes = await getAllFactionsUser();

            const challsResFiltered = challsRes.filter((c: Challenge) => c.category != 'Free');
            setChallenges(challsResFiltered);
            setUsers(usersRes);
            setTeams(teamsRes);
            setFactions(factionsRes);
        } catch (err) {
            console.error('Erreur chargement challenges', err);
        }
    };

    const fetchValidatedChallenges = async () => {
        try {
            const res = await getAllChallengesValidates();
            setValidatedChallenges(res);
        } catch (err) {
            console.error('Erreur chargement challenges validés', err);
        }
    };

    useEffect(() => {
        fetchChallengesUsersTeamsFactions();
        fetchValidatedChallenges();
    }, []);

    const handleEdit = (challenge: Challenge) => {
        setEditingChallenge(challenge);
        editorRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <AdminLayout allowedRoles={['Admin', 'Arbitre']}>
            <div className="flex flex-col gap-6">
                <RevealSection>
                    {/* Formulaire création / édition */}
                    <ChallengeEditor
                        editingChallenge={editingChallenge}
                        setEditingChallenge={setEditingChallenge}
                        refreshChallenges={fetchChallengesUsersTeamsFactions}
                    />
                </RevealSection>

                <RevealSection delay={0.1}>
                    {/* Liste des challenges */}
                    <AdminChallengeList
                        challenges={challenges}
                        refreshChallenges={() => {
                            fetchChallengesUsersTeamsFactions();
                            fetchValidatedChallenges();
                        }}
                        onEdit={handleEdit}
                        users={users}
                        teams={teams}
                        factions={factions}
                    />
                </RevealSection>

                <RevealSection delay={0.2}>
                    {/* Ajout de points */}
                    <AdminChallengeAddPointsForm />
                </RevealSection>

                <RevealSection delay={0.3}>
                    {/* Liste des challenges validés */}
                    <AdminValidatedChallengesList
                        validatedChallenges={validatedChallenges}
                        fetchValidatedChallenges={fetchValidatedChallenges}
                    />
                </RevealSection>
            </div>
        </AdminLayout>
    );
};

export default AdminPageChallenges;
