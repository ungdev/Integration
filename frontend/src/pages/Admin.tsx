import { AdminRoleManagement, AdminRolePreferences } from "../components/Admin/adminRole";
import { AdminShotgun } from "../components/Admin/adminEvent";
import { AdminTeamManagement, DistributeTeam } from "../components/Admin/adminTeam";  // Importer le composant
import { AdminLayout } from "../components/Admin/adminLayout";
import { AdminExportConnect, ImportPermCSV } from "../components/Admin/adminExportImport";
import { AdminFactionManagement } from "../components/Admin/adminFaction";
import { AdminPermanence } from "../components/Admin/adminPerm";
import { AdminChallengeAddPointsForm, AdminChallengeForm, AdminValidatedChallengesList } from "../components/Admin/adminChallenge";
import { AdminEmail } from "../components/Admin/adminEmail";
import { AdminSyncNewStudent, AdminUser } from "../components/Admin/adminUser";



export const AdminPageTeam: React.FC = () => {
  return (
    <AdminLayout>
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
    <AdminLayout>
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
    <AdminLayout>
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

export const AdminPageShotgun: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl bg-white shadow p-6">
          <AdminShotgun />
        </section>
      </div>
    </AdminLayout>
  );
};

export const AdminPageExport: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl bg-white shadow p-6">
          <AdminExportConnect />
          <ImportPermCSV/>
        </section>
      </div>
    </AdminLayout>
  );
};


export const AdminPagePerm: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl bg-white shadow p-6">
          <AdminPermanence />
        </section>
      </div>
    </AdminLayout>
  );
};

export const AdminPageChall: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl bg-white shadow p-6">
          < AdminChallengeForm/>
          < AdminChallengeAddPointsForm/>
          <AdminValidatedChallengesList/>
        </section>
      </div>
    </AdminLayout>
  );
};

export const AdminPageEmail: React.FC = () => {
  return (
    <AdminLayout>
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
    <AdminLayout>
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