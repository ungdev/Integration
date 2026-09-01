import { AdminFactionManagement } from '../../components/Admin/adminFaction';
import { AdminLayout } from '../../components/Admin/adminLayout';
import RevealSection from '../../components/ui/revealSection';

const AdminPageFaction: React.FC = () => (
    <AdminLayout allowedRoles={['Admin', 'Respo CE']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminFactionManagement />
            </RevealSection>
        </div>
    </AdminLayout>
);

export default AdminPageFaction;
