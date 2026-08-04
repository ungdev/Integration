import { AdminRolePointsManager } from '../../components/Admin/adminGames';
import { AdminLayout } from '../../components/Admin/adminLayout';
import { RevealSection } from '../../components/ui/revealSection';

const AdminPageGames: React.FC = () => (
    <AdminLayout allowedRoles={['Admin']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminRolePointsManager />
            </RevealSection>
        </div>
    </AdminLayout>
);

export default AdminPageGames;
