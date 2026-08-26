import { useEffect, useState } from 'react';

import { useUser } from '../../contexts/user';
import type { MakerBattleGroupResponseData } from '../../interfaces/maker_battle.interface';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const MakerBattle = () => {
    const [groupInfos, setGroupInfos] = useState<MakerBattleGroupResponseData | null>({ groupId: 16 });
    const [loading, setLoading] = useState<boolean>(true);
    const { user, loading: userLoading } = useUser();

    useEffect(() => {
        const fetchGroup = async () => {
            // const group = await getUserGroup();
            const group = {
                groupId: 16,
            };
            setGroupInfos(group);
            setLoading(false);
        };

        if (user?.permission === 'Nouveau') {
            void fetchGroup();
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
        <div className="py-12">
            <Card className="bg-gradient-to-r from-blue-400 to-blue-600 w-full max-w-7xl mx-auto gap-3 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-3xl font-semibold text-white font-bold text-center">
                        Trouve ta table au défi {user.branch} !
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center text-gray-100 flex flex-col gap-2">
                    <p>Tu as été placé(e) à la table</p>
                    <p>
                        <strong className="text-white text-xl font-bold">
                            <i>{groupInfos.groupId}</i>
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
