import { AdminLayout } from '../../components/Admin/adminLayout';
import { AdminSettings } from '../../components/Admin/adminSettings';
import { RevealSection } from '../../components/ui/revealSection';

const AdminPageSettings: React.FC = () => (
    <AdminLayout allowedRoles={['Admin']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminSettings />
            </RevealSection>
        </div>
    </AdminLayout>
);

export default AdminPageSettings;
