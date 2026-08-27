import type { MakerBattleGroupTypeOption } from '../../interfaces/maker_battle.interface';
import api from '../api';

export const allocateGroups = async (groups: MakerBattleGroupTypeOption[]) => {
    const response = await api.post('/maker-battle/admin/allocate', { groups: groups.map((group) => group.value) });
    return response.data;
};

export const fetchExportData = async (group: MakerBattleGroupTypeOption) => {
    const response = await api.get(`/maker-battle/admin/export/${group.value}`);
    return response.data;
};

export const getUserGroup = async () => {
    const response = await api.get(`/maker-battle/group/me`);
    return response.data;
};
