import { AdminBusTools } from '../../components/Admin/adminBus';
import { AdminLayout } from '../../components/Admin/adminLayout';
import RevealSection from '../../components/ui/revealSection';

const AdminPageBus: React.FC = () => (
    <AdminLayout allowedRoles={['Admin']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminBusTools />
            </RevealSection>
        </div>
    </AdminLayout>
);

export default AdminPageBus;
