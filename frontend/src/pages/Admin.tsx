import { AdminRoleManagement, AdminRolePreferences } from "../components/Admin/adminRole";
import { AdminEvents } from "../components/Admin/adminEvent";
import { AdminTeamManagement, DistributeTeam } from "../components/Admin/adminTeam";
import { AdminLayout } from "../components/Admin/adminLayout";
import { AdminExportConnect, AdminImportFoodMenu, AdminImportPlannings } from "../components/Admin/adminExportImport";
import { AdminFactionManagement } from "../components/Admin/adminFaction";
import { AdminPermanence, ImportPermCSV } from "../components/Admin/adminPerm";
import { AdminEmail } from "../components/Admin/adminEmail";
import { AdminSyncNewStudent, AdminUser } from "../components/Admin/adminUser";
import { AdminNews } from "../components/Admin/adminNews";
import { AdminRolePointsManager } from "../components/Admin/adminGames";

//--------------Challenge Import--------------//
import ChallengeEditor from "../components/Admin/AdminChallenge/adminChallengeEditor";
import AdminChallengeList from "../components/Admin/AdminChallenge/adminChalengeList";
import { useEffect, useRef, useState } from "react";
import { Challenge } from "../interfaces/challenge.interface";
import { getAllChallenges } from "../services/requests/challenge.service";
import { AdminChallengeAddPointsForm } from "../components/Admin/AdminChallenge/adminChallengeAddPointsForm";
import { AdminValidatedChallengesList } from "../components/Admin/AdminChallenge/adminChallengeValidatedList";
import { TentAdmin } from "../components/Admin/adminTent";



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
  return (
    <AdminLayout allowedRoles={["Admin"]}>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl bg-white shadow p-6">
          <AdminPermanence />
        </section>
        <section className="rounded-2xl bg-white shadow p-6">
          <ImportPermCSV/>
        </section>
      </div>
    </AdminLayout>
  );
};

export const AdminPageChall: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const fetchChallenges = async () => {
    try {
      const res = await getAllChallenges();
      setChallenges(res);
    } catch (err) {
      console.error("Erreur chargement challenges", err);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleEdit = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    editorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AdminLayout allowedRoles={["Admin", "Arbitre"]}>
      <div className="flex flex-col gap-6">
        
        {/* Formulaire création / édition */}
        <section ref={editorRef} className="rounded-2xl bg-white shadow p-6">
          <ChallengeEditor
            editingChallenge={editingChallenge}
            setEditingChallenge={setEditingChallenge}
            refreshChallenges={fetchChallenges}
          />
        </section>

        {/* Liste des challenges */}
        <section className="rounded-2xl bg-white shadow p-6">
          <AdminChallengeList
            challenges={challenges}
            refreshChallenges={fetchChallenges}
            onEdit={handleEdit}
          />
        </section>

        {/* Ajout de points */}
        <section className="rounded-2xl bg-white shadow p-6">
          <AdminChallengeAddPointsForm />
        </section>

        {/* Liste des challenges validés */}
        <section className="rounded-2xl bg-white shadow p-6">
          <AdminValidatedChallengesList />
        </section>
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
          < TentAdmin/>
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