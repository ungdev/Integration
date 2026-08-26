import { useCallback, useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';

import { type Challenge } from '../../interfaces/challenge.interface';
import { type Faction } from '../../interfaces/faction.interface';
import { getAllChallenges, getFactionsPoints } from '../../services/requests/challenge.service';
import { getAllFactionsUser } from '../../services/requests/faction.service';
import { checkChallengeStatus } from '../../services/requests/settings.service';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const UserChallengeList = () => {
    const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>([]);
    const [factions, setFactions] = useState<Faction[]>([]);
    const [factionPoints, setFactionPoints] = useState<{ [key: number]: number }>({});
    const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [isChallOpen, setIsChallOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchChallenges = useCallback(async () => {
        try {
            const challenges = await getAllChallenges();
            const challengesFiltered = challenges.filter((c: Challenge) => c.category !== 'Free');
            setAvailableChallenges(challengesFiltered);
        } catch (err) {
            console.error('Erreur lors du chargement des challenges', err);
        }
    }, []);

    const fetchFactions = useCallback(async () => {
        try {
            const data = await getAllFactionsUser();
            setFactions(data);
        } catch (err) {
            console.error('Erreur lors du chargement des factions', err);
        }
    }, []);

    const fetchFactionPoints = useCallback(async () => {
        try {
            const points: { [key: number]: number } = {};
            const fetchedFactions = await getAllFactionsUser();
            await Promise.all(
                fetchedFactions.map(async (faction: Faction) => {
                    const res = await getFactionsPoints(faction.factionId);
                    points[faction.factionId] = Number(res);
                }),
            );
            setFactionPoints(points);
        } catch (err) {
            console.error('Erreur lors du chargement des points des factions', err);
        }
    }, []);

    const fetchInitialData = useCallback(async () => {
        await Promise.all([fetchChallenges(), fetchFactions()]);
        await fetchFactionPoints();
    }, [fetchChallenges, fetchFactions, fetchFactionPoints]);

    useEffect(() => {
        const init = async () => {
            try {
                await fetchInitialData();
                const status = await checkChallengeStatus();
                setIsChallOpen(status);
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Oups...',
                    text: 'Une erreur est survenue lors de la récupération des données.',
                });
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [fetchInitialData]);

    const dynamicCategories = useMemo(() => {
        const uniqueCategories = new Set(availableChallenges.map((c) => c.category));
        return ['Tous', ...Array.from(uniqueCategories)];
    }, [availableChallenges]);

    const filteredAndSortedChallenges = useMemo(() => {
        let challenges = [...availableChallenges];

        if (selectedCategory !== 'Tous') {
            challenges = challenges.filter((c) => c.category === selectedCategory);
        }

        challenges.sort((a, b) => (sortOrder === 'asc' ? a.points - b.points : b.points - a.points));

        return challenges;
    }, [availableChallenges, selectedCategory, sortOrder]);

    return (
        <div className="flex flex-col items-center px-4 py-8 space-y-8 max-w-full min-h-screen mx-auto">
            {/* Points des Factions */}
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                        🏅 Points des Factions
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-10">
                    <div className="text-center text-gray-700">
                        {factions.length > 0 ? (
                            <div className="space-y-3">
                                {factions.map((faction) => (
                                    <p key={faction.factionId} className="text-xl font-semibold">
                                        {faction.name} : {factionPoints[faction.factionId] ?? 0} points
                                    </p>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Chargement des points...</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Formulaire de validation de challenge */}

            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-gray-800 text-center">Valider un Défi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-10">
                    {!isChallOpen ? (
                        <p className="text-red-500 font-medium text-center">
                            🚫 Ce formulaire n'est pas encore disponible.
                        </p>
                    ) : (
                        <div className="relative pb-[56.25%] rounded-xl shadow-lg overflow-hidden">
                            <iframe
                                src="https://docs.google.com/forms/d/e/1FAIpQLScZZRe1DSqqJOdgBK_5QBlOVMXmIPv9jDlqDD6FqRhmkb8rIw/viewform?embedded=true"
                                className="absolute inset-0 w-full h-full border-none"
                                title="Formulaire Challenge"
                                loading="lazy">
                                Chargement…
                            </iframe>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Challenges disponibles */}
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                        🏆 Défis disponibles
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-10">
                    {loading ? (
                        <p className="text-gray-500 text-center">Chargement en cours...</p>
                    ) : !isChallOpen ? (
                        <p className="text-red-500 font-medium text-center">
                            🚫 Les challenges ne sont pas encore ouverts.
                        </p>
                    ) : availableChallenges.length === 0 ? (
                        <p className="text-gray-500 text-center">Aucun défi disponible pour le moment.</p>
                    ) : (
                        <>
                            {/* Filtres */}
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div>
                                    <label htmlFor="categorySelect" className="font-semibold mr-2">
                                        Filtrer par catégorie :
                                    </label>
                                    <select
                                        id="categorySelect"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="border border-gray-300 rounded px-3 py-1">
                                        {dynamicCategories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="sortOrderSelect" className="font-semibold mr-2">
                                        Trier par points :
                                    </label>
                                    <select
                                        id="sortOrderSelect"
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                                        className="border border-gray-300 rounded px-3 py-1">
                                        <option value="asc">Croissant</option>
                                        <option value="desc">Décroissant</option>
                                    </select>
                                </div>
                            </div>

                            {/* Liste des challenges */}
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                                {filteredAndSortedChallenges.map((challenge) => (
                                    <li
                                        key={challenge.id}
                                        className="bg-gray-100 py-4 px-6 rounded-xl border border-gray-300 shadow-sm hover:bg-gray-200 transition">
                                        <h4 className="font-semibold text-lg">{challenge.title}</h4>
                                        <p className="text-gray-600 mt-2">{challenge.description}</p>
                                        <div className="mt-2 text-gray-500 text-sm">
                                            <p>
                                                <strong>Catégorie :</strong> {challenge.category}
                                            </p>
                                            <p>
                                                <strong>Points :</strong> {challenge.points}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
