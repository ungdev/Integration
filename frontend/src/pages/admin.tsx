//--------------Challenge Import--------------//
import { useEffect, useRef, useState } from 'react';

import { AdminBannedAddEmail, AdminBannedList } from '../components/Admin/adminBanned';
import { AdminBusTools } from '../components/Admin/adminBus';
import AdminChallengeList from '../components/Admin/AdminChallenge/adminChalengeList';
import { AdminChallengeAddPointsForm } from '../components/Admin/AdminChallenge/adminChallengeAddPointsForm';
import ChallengeEditor from '../components/Admin/AdminChallenge/adminChallengeEditor';
import { AdminValidatedChallengesList } from '../components/Admin/AdminChallenge/adminChallengeValidatedList';
import { AdminEmail } from '../components/Admin/adminEmail';
import { AdminEvents } from '../components/Admin/adminEvent';
import {
    AdminExportConnect,
    AdminImportFoodMenu,
    AdminImportNotebooks,
    AdminImportPlannings,
} from '../components/Admin/adminExportImport';
import { AdminFactionManagement } from '../components/Admin/adminFaction';
import { AdminRolePointsManager } from '../components/Admin/adminGames';
import { AdminLayout } from '../components/Admin/adminLayout';
import { AdminNews } from '../components/Admin/adminNews';
//--------------Perm Import--------------//
import PermanenceActions from '../components/Admin/AdminPerm/adminPermAction';
import PermanenceForm from '../components/Admin/AdminPerm/adminPermForm';
import { ImportPermCSV } from '../components/Admin/AdminPerm/adminPermImport';
import PermanenceList from '../components/Admin/AdminPerm/adminPermList';
import { AdminRoleManagement, AdminRolePreferences } from '../components/Admin/adminRole';
import { AdminShotgunRanking } from '../components/Admin/adminShotgun';
import { AdminTeamManagement, DistributeTeam } from '../components/Admin/adminTeam';
import { TentAdmin } from '../components/Admin/adminTent';
import { AdminRegisterNewStudent, AdminSyncNewStudent, AdminUser } from '../components/Admin/adminUser';
import { RevealSection } from '../components/ui/revealSection';
import { type Banned } from '../interfaces/banned.interface';
import { type Challenge, type ValidatedChallenge } from '../interfaces/challenge.interface';
import { type Faction } from '../interfaces/faction.interface';
import { type Permanence } from '../interfaces/permanence.interface';
import { type Team } from '../interfaces/team.interface';
import { type User } from '../interfaces/user.interface';
import { getAllChallenges, getAllChallengesValidates } from '../services/requests/challenge.service';
import { getAllFactionsUser } from '../services/requests/faction.service';
import { getAllPermanences } from '../services/requests/permanence.service';
import { getAllTeams } from '../services/requests/team.service';
import { getUsers, getUsersAdmin } from '../services/requests/user.service';

export const AdminPageTeam: React.FC = () => (
    <AdminLayout allowedRoles={['Admin', 'Respo CE']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminTeamManagement />
            </RevealSection>

            <RevealSection delay={0.1}>
                <DistributeTeam />
            </RevealSection>
        </div>
    </AdminLayout>
);

export const AdminPageFaction: React.FC = () => (
    <AdminLayout allowedRoles={['Admin', 'Respo CE']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminFactionManagement />
            </RevealSection>
        </div>
    </AdminLayout>
);

export const AdminPageRole: React.FC = () => (
    <AdminLayout allowedRoles={['Admin']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminRolePreferences />
            </RevealSection>

            <RevealSection delay={0.1}>
                <AdminRoleManagement />
            </RevealSection>
        </div>
    </AdminLayout>
);

export const AdminPageEvents: React.FC = () => (
    <AdminLayout allowedRoles={['Admin']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminEvents />
            </RevealSection>
        </div>
    </AdminLayout>
);

export const AdminPageShotgun: React.FC = () => (
    <AdminLayout allowedRoles={['Admin', 'Respo CE']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminShotgunRanking />
            </RevealSection>
        </div>
    </AdminLayout>
);

export const AdminPageExport: React.FC = () => (
    <AdminLayout allowedRoles={['Admin']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminExportConnect />
            </RevealSection>

            <RevealSection delay={0.1}>
                <AdminImportFoodMenu />
            </RevealSection>

            <RevealSection delay={0.2}>
                <AdminImportPlannings />
            </RevealSection>

            <RevealSection delay={0.3}>
                <AdminImportNotebooks />
            </RevealSection>
        </div>
    </AdminLayout>
);

export const AdminPagePerm: React.FC = () => {
    const [permanences, setPermanences] = useState<Permanence[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editPermanence, setEditPermanence] = useState<Permanence | null>(null);

    const editorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        void fetchPermanences();
        void fetchUsers();
    }, []);

    const fetchPermanences = async () => {
        const res = await getAllPermanences();
        setPermanences(res.data as Permanence[]);
    };

    const fetchUsers = async () => {
        const res = await getUsersAdmin();
        setUsers(res as User[]);
    };

    return (
        <AdminLayout allowedRoles={['Admin', 'Respo CE']}>
            <div className="flex flex-col gap-10 px-4 py-6 max-w-7xl mx-auto">
                {/* Formulaire (créer/éditer) */}
                <RevealSection>
                    <PermanenceForm
                        editMode={editMode}
                        editPermanence={editPermanence}
                        onRefresh={fetchPermanences}
                        onCancelEdit={() => {
                            setEditMode(false);
                            setEditPermanence(null);
                        }}
                    />
                </RevealSection>

                {/* Liste des permanences */}
                <RevealSection delay={0.1}>
                    <PermanenceList
                        permanences={permanences}
                        users={users}
                        onRefresh={fetchPermanences}
                        onEdit={(perm: Permanence) => {
                            setEditMode(true);
                            setEditPermanence(perm);
                            setTimeout(() => {
                                editorRef.current?.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                        }}
                    />
                </RevealSection>

                {/* Actions globales */}
                <RevealSection delay={0.2}>
                    <PermanenceActions permanences={permanences} onRefresh={fetchPermanences} />
                </RevealSection>

                {/* Import CSV (si dispo) */}
                <RevealSection delay={0.3}>
                    <ImportPermCSV />
                </RevealSection>
            </div>
        </AdminLayout>
    );
};

export const AdminPageChall: React.FC = () => {
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

export const AdminPageEmail: React.FC = () => (
    <AdminLayout allowedRoles={['Admin']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminEmail />
            </RevealSection>
        </div>
    </AdminLayout>
);

export const AdminPageUser: React.FC = () => (
    <AdminLayout allowedRoles={['Admin']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminUser />
            </RevealSection>

            <RevealSection delay={0.1}>
                <AdminSyncNewStudent />
            </RevealSection>

            <RevealSection delay={0.2}>
                <AdminRegisterNewStudent />
            </RevealSection>
        </div>
    </AdminLayout>
);

export const AdminPageNews: React.FC = () => (
    <AdminLayout allowedRoles={['Admin', 'Communication']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminNews />
            </RevealSection>
        </div>
    </AdminLayout>
);

export const AdminPageTent: React.FC = () => (
    <AdminLayout allowedRoles={['Admin']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <TentAdmin />
            </RevealSection>
        </div>
    </AdminLayout>
);

export const AdminPageBus: React.FC = () => (
    <AdminLayout allowedRoles={['Admin']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminBusTools />
            </RevealSection>
        </div>
    </AdminLayout>
);

export const AdminPageGames: React.FC = () => (
    <AdminLayout allowedRoles={['Admin']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminRolePointsManager />
            </RevealSection>
        </div>
    </AdminLayout>
);

export const AdminBanned: React.FC = () => {
    const [bannedList, setBannedList] = useState<Banned[]>([]);

    return (
        <AdminLayout allowedRoles={['Admin']}>
            <div className="flex flex-col gap-6">
                <RevealSection>
                    <AdminBannedList bannedList={bannedList} setBannedList={setBannedList} />
                </RevealSection>

                <RevealSection delay={0.1}>
                    <AdminBannedAddEmail bannedList={bannedList} setBannedList={setBannedList} />
                </RevealSection>
            </div>
        </AdminLayout>
    );
};
