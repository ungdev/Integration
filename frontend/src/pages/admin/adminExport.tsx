import {
    AdminExportConnect,
    AdminImportFoodMenu,
    AdminImportNotebooks,
    AdminImportPlannings,
} from '../../components/Admin/adminExportImport';
import { AdminLayout } from '../../components/Admin/adminLayout';
import { RevealSection } from '../../components/ui/revealSection';

const AdminPageExport: React.FC = () => (
    <AdminLayout allowedRoles={['Admin']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminExportConnect />
            </RevealSection>

            <RevealSection delay={0.1}>
                <AdminImportFoodMenu />
            </RevealSection>

            <RevealSection delay={0.2}>
                <AdminImportPlannings />
            </RevealSection>

            <RevealSection delay={0.3}>
                <AdminImportNotebooks />
            </RevealSection>
        </div>
    </AdminLayout>
);

export default AdminPageExport;
