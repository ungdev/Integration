import { AdminLayout } from '../../components/Admin/adminLayout';
import { AdminShotgunRanking } from '../../components/Admin/adminShotgun';
import { RevealSection } from '../../components/ui/revealSection';

const AdminPageShotgun: React.FC = () => (
    <AdminLayout allowedRoles={['Admin', 'Respo CE']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminShotgunRanking />
            </RevealSection>
        </div>
    </AdminLayout>
);
export default AdminPageShotgun;
