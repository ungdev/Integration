import { AdminLayout } from '../../components/Admin/adminLayout';
import { AdminNews } from '../../components/Admin/adminNews';
import RevealSection from '../../components/ui/revealSection';

const AdminPageNews: React.FC = () => (
    <AdminLayout allowedRoles={['Admin', 'Communication']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminNews />
            </RevealSection>
        </div>
    </AdminLayout>
);

export default AdminPageNews;
