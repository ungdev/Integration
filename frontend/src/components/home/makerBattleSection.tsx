import { useEffect, useState } from 'react';

import { useUser } from '../../contexts/user';
import type { MakerBattleGroupResponseData } from '../../interfaces/maker_battle.interface';
import { getUserGroup } from '../../services/requests/maker_battle.service';
import { checkMakerBattleGroupStatus } from '../../services/requests/settings.service';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const MakerBattle = () => {
    const [groupInfos, setGroupInfos] = useState<MakerBattleGroupResponseData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [makerBattleType, setMakerBattleType] = useState<string>('');
    const { user, loading: userLoading } = useUser();

    useEffect(() => {
        const fetchGroup = async () => {
            const isEnabled = await checkMakerBattleGroupStatus();

            if (!isEnabled) {
                setLoading(false);
                return;
            }

            const { group } = await getUserGroup();
            setGroupInfos(group);
            setLoading(false);
        };

        if (user?.permission === 'Nouveau') {
            void fetchGroup();
            setMakerBattleType(['TC', 'IA_BACH'].includes(user.branch) ? 'TC' : 'Branche');
        } else {
            // if not a new user, we don't need to load team
            setLoading(false);
        }
    }, [user]);

    const loadingDiv = (
        <div className="py-12">
            <Card className="bg-gradient-to-r from-gray-100 to-gray-200 w-full max-w-7xl mx-auto gap-3 shadow-lg">
                <CardContent className="text-center flex flex-col gap-2">
                    <p>Chargement de ton groupe de défis...</p>
                </CardContent>
            </Card>
        </div>
    );

    if (userLoading) {
        return loadingDiv;
    }

    if (user?.permission !== 'Nouveau') {
        return;
    }

    if (loading) {
        return loadingDiv;
    }

    if (!groupInfos) {
        return;
    }

    return (
        <div className="pt-12">
            <Card className="bg-gradient-to-r from-blue-400 to-blue-600 w-full max-w-7xl mx-auto gap-3 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-3xl font-semibold text-white font-bold text-center">
                        Trouve ta table au défi {makerBattleType} !
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center text-gray-100 flex flex-col gap-2">
                    <p>Tu as été placé(e) à la table</p>
                    <p>
                        <strong className="text-white text-xl font-bold">
                            <i>{groupInfos.table}</i>
                        </strong>
                    </p>
                    <p>
                        Rejoins ta table dès que possible pour rencontrer tes cohéquipiers et cohéquipières pour relever
                        le défi !
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
