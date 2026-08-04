import { AdminEmail } from '../../components/Admin/adminEmail';
import { AdminLayout } from '../../components/Admin/adminLayout';
import { RevealSection } from '../../components/ui/revealSection';

const AdminPageEmail: React.FC = () => (
    <AdminLayout allowedRoles={['Admin']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminEmail />
            </RevealSection>
        </div>
    </AdminLayout>
);

export default AdminPageEmail;
