import { AdminLayout } from '../../components/Admin/adminLayout';
import { TentAdmin } from '../../components/Admin/adminTent';
import RevealSection from '../../components/ui/revealSection';

const AdminPageTent: React.FC = () => (
    <AdminLayout allowedRoles={['Admin']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <TentAdmin />
            </RevealSection>
        </div>
    </AdminLayout>
);

export default AdminPageTent;
