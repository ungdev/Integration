import { AdminLayout } from '../../components/Admin/adminLayout';
import { AdminTeamManagement, DistributeTeam } from '../../components/Admin/adminTeam';
import { RevealSection } from '../../components/ui/revealSection';

const AdminPageTeam: React.FC = () => (
    <AdminLayout allowedRoles={['Admin', 'Respo CE']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminTeamManagement />
            </RevealSection>

            <RevealSection delay={0.1}>
                <DistributeTeam />
            </RevealSection>
        </div>
    </AdminLayout>
);

export default AdminPageTeam;
