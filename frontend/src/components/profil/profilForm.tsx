import { useEffect, useState } from 'react';
// import { FaDiscord } from 'react-icons/fa';
import Select from 'react-select';

import { useUser } from '../../contexts/user';
import { updateCurrentUser } from '../../services/requests/user.service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';

const branchOptions = [
    { value: 'TC', label: 'Tronc Commun' },
    { value: 'RT', label: 'Réseaux et Télcommunications' },
    { value: 'ISI', label: "Informatique et Systèmes d'Information" },
    { value: 'GM', label: 'Génie Mécanique' },
    { value: 'GI', label: 'Génie Industriel' },
    { value: 'MTE', label: 'Matériaux : Technologie et Economie' },
    { value: 'A2I', label: 'Automatique & Informatique Industrielle' },
    { value: 'GI_APPR', label: 'Génie Industriel en Apprentissage' },
    { value: 'GM_APPR', label: 'Génie Mécanique en Apprentissage' },
    { value: 'SN_APPR', label: 'Systeme Numérique en Apprentissage' },
    { value: 'Branch', label: 'Branche' },
    { value: 'IA_BACH', label: 'Intelligence Artificielle en bachelor' },
    { value: 'MM', label: 'Mécanique et Matériaux' },
    { value: 'Master', label: 'Master' },
    { value: 'RI', label: 'Ressources International' },
];

export const ProfilForm = () => {
    const { user, loading: userLoading, refreshUser } = useUser();
    const [branch, setBranch] = useState('');
    const [contact, setContact] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setBranch(user.branch || '');
            setContact(user.contact || '');
        }
    }, [user]);

    const handleSubmit = async () => {
        setLoading(true);
        const response = await updateCurrentUser({ branch: branch, contact: contact });
        // refresh cached user data after update
        try {
            await refreshUser();
        } catch {
            alert(response.message);
        }
        setLoading(false);
    };

    if (userLoading || loading) return null;
    if (!user) return null;

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">👤 Mon Profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <label htmlFor="profile-first-name" className="block text-sm font-medium">
                        Prénom
                    </label>
                    <Input id="profile-first-name" value={user.firstName} disabled />
                </div>
                <div>
                    <label htmlFor="profile-last-name" className="block text-sm font-medium">
                        Nom
                    </label>
                    <Input id="profile-last-name" value={user.lastName} disabled />
                </div>
                <div>
                    <label htmlFor="profile-email" className="block text-sm font-medium">
                        Email
                    </label>
                    <Input id="profile-email" value={user.email} disabled />
                </div>
                <div>
                    <label htmlFor="profile-permission" className="block text-sm font-medium">
                        Permission
                    </label>
                    <Input id="profile-permission" value={user.permission} disabled />
                </div>
                <div>
                    <label htmlFor="profile-branch" className="block text-sm font-medium">
                        Filière
                    </label>
                    <Select
                        inputId="profile-branch"
                        value={branchOptions.find((b) => b.value === branch)}
                        onChange={(selected) => {
                            if (selected) {
                                setBranch(selected.value);
                            } else {
                                setBranch('');
                            }
                        }}
                        options={branchOptions}
                        placeholder="Choisir une filière"
                        isClearable
                    />
                </div>
                <div
                    className={`${user.contact === null || user.contact === '' ? 'p-4 rounded-lg bg-yellow-100 border border-yellow-300' : ''}`}>
                    {user.permission === 'Student' || user.permission === 'Admin' ? (
                        <label htmlFor="profile-contact" className="block text-sm font-medium">
                            Contact - <u>Comment tes nouveaux pourront te contacter !</u>
                        </label>
                    ) : (
                        <label htmlFor="profile-contact" className="block text-sm font-medium">
                            Contact (visible uniquement pour les organisateurs)
                        </label>
                    )}
                    <Input
                        id="profile-contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className={user.contact === null || user.contact === '' ? 'bg-white' : ''}
                    />
                </div>
                <Button onClick={handleSubmit} disabled={loading} className="w-full">
                    {loading ? 'Enregistrement...' : '💾 Sauvegarder'}
                </Button>
                {/* <>
                    {user.discord_id ? (
                        <div className="w-full p-4 bg-green-100 text-green-800 rounded text-center">
                            ✅ Ton compte Discord est bien lié !
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                window.location.href =
                                    'https://discord.com/oauth2/authorize?client_id=1400196109434884189&response_type=code&redirect_uri=https%3A%2F%2Fintegration.utt.fr%2Fdiscord&scope=identify';
                            }}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2 text-white py-2 rounded">
                            <FaDiscord size={20} />
                            Lier mon compte Discord
                        </button>
                    )}
                </> */}
            </CardContent>
        </Card>
    );
};
