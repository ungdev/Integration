import { AdminLayout } from '../../components/Admin/adminLayout';
import { AdminRegisterNewStudent, AdminSyncNewStudent, AdminUser } from '../../components/Admin/adminUser';
import { RevealSection } from '../../components/ui/revealSection';

const AdminPageUser: React.FC = () => (
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

export default AdminPageUser;
