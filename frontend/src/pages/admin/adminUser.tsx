import { AdminLayout } from '../../components/Admin/adminLayout';
import AdminUserImportFromSIEP from '../../components/Admin/AdminUser/adminUserImportFromSIEP';
import AdminUserProfile from '../../components/Admin/AdminUser/adminUserProfile';
import AdminUserRegisterNewStudent from '../../components/Admin/AdminUser/adminUserRegisterNewStudent';
import RevealSection from '../../components/ui/revealSection';

const AdminPageUser: React.FC = () => (
    <AdminLayout allowedRoles={['Admin']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminUserProfile />
            </RevealSection>

            <RevealSection delay={0.1}>
                <AdminUserImportFromSIEP />
            </RevealSection>

            <RevealSection delay={0.2}>
                <AdminUserRegisterNewStudent />
            </RevealSection>
        </div>
    </AdminLayout>
);

export default AdminPageUser;
