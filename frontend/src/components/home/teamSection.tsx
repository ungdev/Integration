import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { type TeamDisplayInfos } from '../../interfaces/team.interface';
import { getUserTeam } from '../../services/requests/team.service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const Team = () => {
    const [teamInfos, setTeamInfos] = useState<TeamDisplayInfos | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        const team = await getUserTeam();
        setTeamInfos(team);
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="py-12">
                <Card className="bg-gradient-to-r from-gray-100 to-gray-200 w-full max-w-7xl mx-auto gap-3 shadow-lg">
                    <CardContent className="text-center flex flex-col gap-2">
                        <p>Chargement de ton équipe...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!teamInfos) {
        return (
            <div className="py-12">
                <Card className="bg-gradient-to-r from-gray-100 to-gray-200 w-full max-w-7xl mx-auto gap-3 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-3xl font-semibold font-bold text-center">
                            Ton équipe arrive bientôt !
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center flex flex-col gap-2">
                        <p>
                            Tu n'as pas encore été placé(e) dans une équipe d'intégration.
                            <br />
                            Pas de panique ! Ce sera bientôt le cas et tu pourras rejoindre le groupe WhatsApp de ton
                            équipe pour ne rien manquer des infos et activités à venir !
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="py-12">
            <Card className="bg-gradient-to-r from-pink-400 to-pink-600 w-full max-w-7xl mx-auto gap-3 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-3xl font-semibold text-white font-bold text-center">
                        Découvre ton équipe d'intégration !
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center text-gray-100 flex flex-col gap-2">
                    <p>Tu as été placé(e) dans l'équipe</p>
                    <p>
                        <strong className="text-white text-xl font-bold">
                            <i>{teamInfos.name}</i>
                        </strong>
                        <br />
                        Faction
                        <strong>
                            <i>{' ' + teamInfos.faction_name}</i>
                        </strong>
                    </p>
                    <p>
                        Cette équipe est consituée de Chefs d'équipes (CE), déjà étudiants à l'UTT, et d'un certain
                        nombre de Nouveaux comme toi !
                        <br />
                        L'idéal pour découvrir la vie à Troyes, sur le Campus, rencontrer tes futurs amis et réaliser
                        les défis d'Intégration !
                    </p>
                    <p>
                        Rejoins dès maintenant le groupe WhatsApp de ton équipe pour ne rien manquer des infos et
                        activités à venir !
                    </p>
                    {teamInfos.social_link ? (
                        <Button asChild className="text-white bg-blue-600 hover:bg-blue-800 w-1/2 mx-auto">
                            <Link to={teamInfos.social_link} target="_blank">
                                Rejoindre le groupe WhatsApp
                            </Link>
                        </Button>
                    ) : (
                        <Button
                            asChild
                            className="text-red-100 bg-gray-400 hover:bg-gray-400 w-1/2 mx-auto cursor-not-allowed"
                            disabled>
                            <p>🚫 Le groupe n'est pas encore accessible.</p>
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
