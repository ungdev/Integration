import { AdminRoleManagement, AdminRolePreferences } from "src/components/Admin/adminRole";
import { AdminShotgun } from "src/components/Admin/adminEvent";
import { AdminTeamManagement, DistributeTeam } from "src/components/Admin/adminTeam";  // Importer le composant
import { AdminLayout } from "src/components/Admin/adminLayout";
import { AdminExportConnect } from "src/components/Admin/adminExport";
import { AdminFactionManagement } from "src/components/Admin/adminFaction";
import { AdminPermanence } from "src/components/Admin/adminPerm";
import { AdminChallengeAddPointsForm, AdminChallengeForm, AdminValidatedChallengesList } from "src/components/Admin/adminChallenge";
import { AdminEmail } from "src/components/Admin/adminEmail";
import { AdminUser } from "src/components/Admin/adminUser";



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
      </div>
    </AdminLayout>
  );
};