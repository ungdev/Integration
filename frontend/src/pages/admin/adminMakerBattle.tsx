import { AdminLayout } from '../../components/Admin/adminLayout';
import { AdminMakerBattleTeamDownload } from '../../components/Admin/AdminMakerBattle/adminMakerBattleDownload';
import { AdminMakerBattleTeamGeneration } from '../../components/Admin/AdminMakerBattle/adminMakerBattleTeamGeneration';
import { RevealSection } from '../../components/ui/revealSection';
import type { MakerBattleGroupTypeOption } from '../../interfaces/maker_battle.interface';

const groupTypeOptions: MakerBattleGroupTypeOption[] = [
    { value: 'tc', label: 'TC' },
    { value: 'ri', label: 'RI' },
    { value: 'branch', label: 'Branche' },
];

const AdminPageMakerBattle: React.FC = () => (
    <AdminLayout allowedRoles={['Admin', 'Défis TC']}>
        <div className="flex flex-col gap-6">
            <RevealSection>
                <AdminMakerBattleTeamGeneration groupTypeOptions={groupTypeOptions} />
            </RevealSection>
            <RevealSection delay={0.1}>
                <AdminMakerBattleTeamDownload groupTypeOptions={groupTypeOptions} />
            </RevealSection>
        </div>
    </AdminLayout>
);

export default AdminPageMakerBattle;
