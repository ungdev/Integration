import { motion } from "framer-motion";

import { AdminRoleManagement, AdminRolePreferences } from "../components/Admin/adminRole";
import { AdminEvents } from "../components/Admin/adminEvent";
import { AdminTeamManagement, DistributeTeam } from "../components/Admin/adminTeam";
import { AdminLayout } from "../components/Admin/adminLayout";
import { AdminExportConnect, AdminImportFoodMenu, AdminImportPlannings } from "../components/Admin/adminExportImport";
import { AdminFactionManagement } from "../components/Admin/adminFaction";
import { AdminEmail } from "../components/Admin/adminEmail";
import { AdminSyncNewStudent, AdminUser } from "../components/Admin/adminUser";
import { AdminNews } from "../components/Admin/adminNews";
import { AdminRolePointsManager } from "../components/Admin/adminGames";
import { AdminBusTools } from "../components/Admin/adminBus";

//--------------Challenge Import--------------//
import ChallengeEditor from "../components/Admin/AdminChallenge/adminChallengeEditor";
import AdminChallengeList from "../components/Admin/AdminChallenge/adminChalengeList";
import { useEffect, useRef, useState } from "react";
import { Challenge, ValidatedChallenge } from "../interfaces/challenge.interface";
import { getAllChallenges, getAllChallengesValidates } from "../services/requests/challenge.service";
import { AdminChallengeAddPointsForm } from "../components/Admin/AdminChallenge/adminChallengeAddPointsForm";
import { AdminValidatedChallengesList } from "../components/Admin/AdminChallenge/adminChallengeValidatedList";
import { TentAdmin } from "../components/Admin/adminTent";


//--------------Perm Import--------------//
import PermanenceActions from "../components/Admin/AdminPerm/adminPermAction";
import PermanenceForm from "../components/Admin/AdminPerm/adminPermForm";
import { ImportPermCSV } from "../components/Admin/AdminPerm/adminPermImport";
import PermanenceList from "../components/Admin/AdminPerm/adminPermList";
import { Permanence } from "../interfaces/permanence.interface";
import { User } from "../interfaces/user.interface";
import { getAllPermanences } from "../services/requests/permanence.service";
import { getUsers, getUsersAdmin } from "../services/requests/user.service";
import { Team } from "../interfaces/team.interface";
import { Faction } from "../interfaces/faction.interface";
import { getAllTeams } from "../services/requests/team.service";
import { getAllFactionsUser } from "../services/requests/faction.service";



export const AdminPageTeam: React.FC = () => {
  return (
    <AdminLayout allowedRoles={["Admin", "Respo CE"]}>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl bg-white shadow p-6">
          <AdminTeamManagement />
        </section>
        <section className="rounded-2xl bg-white shadow p-6">
          <DistributeTeam />
        </section>
      </div>
    </AdminLayout>
  );
};

export const AdminPageFaction: React.FC = () => {
  return (
    <AdminLayout allowedRoles={["Admin", "Respo CE"]}>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl bg-white shadow p-6">
          <AdminFactionManagement />
        </section>
      </div>
    </AdminLayout>
  );
};

export const AdminPageRole: React.FC = () => {
  return (
    <AdminLayout allowedRoles={["Admin"]}>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl bg-white shadow p-6">
          <AdminRolePreferences />
        </section>
        <section className="rounded-2xl bg-white shadow p-6">
          <AdminRoleManagement />
        </section>
      </div>
    </AdminLayout>
  );
};

export const AdminPageEvents: React.FC = () => {
  return (
    <AdminLayout allowedRoles={["Admin"]}>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl bg-white shadow p-6">
          <AdminEvents />
        </section>
      </div>
    </AdminLayout>
  );
};

export const AdminPageExport: React.FC = () => {
  return (
    <AdminLayout allowedRoles={["Admin"]}>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl bg-white shadow p-6">
          <AdminExportConnect />
        </section>
        <section className="rounded-2xl bg-white shadow p-6">
          <AdminImportFoodMenu />
        </section>
        <section className="rounded-2xl bg-white shadow p-6">
          <AdminImportPlannings />
        </section>
      </div>
    </AdminLayout>
  );
};


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
    <AdminLayout allowedRoles={["Admin", "Respo CE"]}>
      <div className="flex flex-col gap-10 px-4 py-6 max-w-7xl mx-auto">

        {/* Formulaire (créer/éditer) */}
        <motion.section
          ref={editorRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl bg-white shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {editMode ? "✏️ Modifier une permanence" : "➕ Créer une permanence"}
          </h1>

          <PermanenceForm
            editMode={editMode}
            editPermanence={editPermanence}
            onRefresh={fetchPermanences}
            onCancelEdit={() => {
              setEditMode(false);
              setEditPermanence(null);
            }}
          />
        </motion.section>

        {/* Liste des permanences */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="rounded-2xl bg-white shadow-lg p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            📋 Permanences existantes
          </h2>
          <PermanenceList
            permanences={permanences}
            users={users}
            onRefresh={fetchPermanences}
            onEdit={(perm: Permanence) => {
              setEditMode(true);
              setEditPermanence(perm);
              setTimeout(() => {
                editorRef.current?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          />
        </motion.section>

         {/* Actions globales */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="rounded-2xl bg-white shadow-lg p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            ⚡ Actions rapides
          </h2>
          <PermanenceActions
            permanences={permanences}
            onRefresh={fetchPermanences}
          />
        </motion.section>

        {/* Import CSV (si dispo) */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="rounded-2xl bg-white shadow-lg p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            📂 Importer des permanences (CSV)
          </h2>
          <ImportPermCSV />
        </motion.section>
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

      const challsResFiltered = challsRes.filter((c : Challenge) => c.category != "Free")
      setChallenges(challsResFiltered);
      setUsers(usersRes);
      setTeams(teamsRes);
      setFactions(factionsRes);

    } catch (err) {
      console.error("Erreur chargement challenges", err);
    }
  };

  const fetchValidatedChallenges = async () => {
  try {
    const res = await getAllChallengesValidates();
    setValidatedChallenges(res);
  } catch (err) {
    console.error("Erreur chargement challenges validés", err);
  }
};
  
  
  useEffect(() => {
    fetchChallengesUsersTeamsFactions();
    fetchValidatedChallenges();
  }, []);

  const handleEdit = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    editorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AdminLayout allowedRoles={["Admin", "Arbitre"]}>
      <div className="flex flex-col gap-6">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl bg-white shadow-lg p-8"
        > 
          {/* Formulaire création / édition */}
          <section ref={editorRef} className="rounded-2xl bg-white shadow p-6">
            <ChallengeEditor
              editingChallenge={editingChallenge}
              setEditingChallenge={setEditingChallenge}
              refreshChallenges={fetchChallengesUsersTeamsFactions}
            />
          </section>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl bg-white shadow-lg p-8"
        > 
        {/* Liste des challenges */}
        <section className="rounded-2xl bg-white shadow p-6">
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
        </section>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl bg-white shadow-lg p-8"
        > 
        {/* Ajout de points */}
        <section className="rounded-2xl bg-white shadow p-6">
          <AdminChallengeAddPointsForm />
        </section>
        </motion.section>


        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl bg-white shadow-lg p-8"
        > 
          {/* Liste des challenges validés */}
          <section className="rounded-2xl bg-white shadow p-6">
            <AdminValidatedChallengesList
              validatedChallenges={validatedChallenges}
              fetchValidatedChallenges={fetchValidatedChallenges}
            />
          </section>
        </motion.section>
      </div>
    </AdminLayout>
  );
};

export const AdminPageEmail: React.FC = () => {
  return (
    <AdminLayout allowedRoles={["Admin"]}>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl bg-white shadow p-6">
          < AdminEmail/>
        </section>
      </div>
    </AdminLayout>
  );
};

export const AdminPageUser: React.FC = () => {
  return (
    <AdminLayout allowedRoles={["Admin"]}>
      <div className="flex flex-col gap-6">
      <section className="rounded-2xl bg-white shadow p-6">
          < AdminUser/>
      </section>
      <section className="rounded-2xl bg-white shadow p-6">
          < AdminSyncNewStudent/>
      </section>
      </div>
    </AdminLayout>
  );
};

export const AdminPageNews: React.FC = () => {
  return (
    <AdminLayout allowedRoles={["Admin", "Communication"]}>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl bg-white shadow p-6">
          < AdminNews/>
        </section>
      </div>
    </AdminLayout>
  );
};

export const AdminPageTent: React.FC = () => {
  return (
    <AdminLayout allowedRoles={["Admin"]}>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl bg-white shadow p-6">
          <TentAdmin />
        </section>
      </div>
    </AdminLayout>
  );
};

export const AdminPageBus: React.FC = () => {
  return (
    <AdminLayout allowedRoles={["Admin"]}>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl bg-white shadow p-6">
          < AdminBusTools/>
        </section>
      </div>
    </AdminLayout>
  );
};

export const AdminPageGames: React.FC = () => {
  return (
    <AdminLayout allowedRoles={["Admin"]}>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl bg-white shadow p-6">
          < AdminRolePointsManager/>
        </section>
      </div>
    </AdminLayout>
  );
};