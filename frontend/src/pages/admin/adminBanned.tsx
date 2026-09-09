import { useState } from 'react';

import { AdminBannedAddEmail, AdminBannedList } from '../../components/Admin/adminBanned';
import { AdminLayout } from '../../components/Admin/adminLayout';
import RevealSection from '../../components/ui/revealSection';
import { type Banned } from '../../interfaces/banned.interface';

const AdminPageBanned: React.FC = () => {
    const [bannedList, setBannedList] = useState<Banned[]>([]);

    return (
        <AdminLayout allowedRoles={['Admin']}>
            <div className="flex flex-col gap-6">
                <RevealSection>
                    <AdminBannedList bannedList={bannedList} setBannedList={setBannedList} />
                </RevealSection>

                <RevealSection delay={0.1}>
                    <AdminBannedAddEmail bannedList={bannedList} setBannedList={setBannedList} />
                </RevealSection>
            </div>
        </AdminLayout>
    );
};

export default AdminPageBanned;
