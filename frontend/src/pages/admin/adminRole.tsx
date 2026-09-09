import { AdminLayout } from '../../components/Admin/adminLayout';
import { AdminRoleManagement, AdminRolePreferences } from '../../components/Admin/adminRole';
import RevealSection from '../../components/ui/revealSection';

const AdminPageRole: React.FC = () => (
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

export default AdminPageRole;
