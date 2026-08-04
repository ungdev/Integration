import { AdminEvents } from '../../components/Admin/adminEvent';
import { AdminLayout } from '../../components/Admin/adminLayout';
import { RevealSection } from '../../components/ui/revealSection';

const AdminPageEvents: React.FC = () => (
    <AdminLayout allowedRoles={['Admin']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminEvents />
            </RevealSection>
        </div>
    </AdminLayout>
);

export default AdminPageEvents;
