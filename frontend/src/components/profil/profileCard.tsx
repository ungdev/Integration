import { useEffect, useState } from 'react';
import Select from 'react-select';
import { type SingleValue } from 'react-select';
import Swal from 'sweetalert2';

import { useUser } from '../../contexts/user';
import { type BranchOption, branchOptions } from '../../interfaces/user.interface';
import { updateCurrentUser } from '../../services/requests/user.service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Input } from '../ui/input';

const ProfileCard = () => {
    const { user, loading: userLoading, refreshUser } = useUser();
    const [isEditingContact, setIsEditingContact] = useState(false);
    const [contactValue, setContactValue] = useState('');
    const [isEditingBranch, setIsEditingBranch] = useState(false);
    const [branchValue, setBranchValue] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setContactValue(user.contact || '');
            setBranchValue(user.branch || '');
        }
    }, [user]);

    const getInitials = () => {
        if (!user) return '?';
        return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
    };

    const getPermissionStyle = (permission: string) => {
        switch (permission) {
            case 'Admin':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'Student':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Nouveau':
                return 'bg-purple-100 text-purple-700 border-purple-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const handleSaveContact = async () => {
        if (!user) return;

        if (!contactValue.trim() || contactValue === user.contact) {
            setIsEditingContact(false);
            return;
        }

        setIsSaving(true);

        try {
            await updateCurrentUser({ contact: contactValue });

            await refreshUser();

            Swal.fire({
                icon: 'success',
                title: 'Modification enregistrée',
                text: 'Votre contact a été mis à jour avec succès.',
                confirmButtonColor: '#16a34a',
            });

            setIsEditingContact(false);
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error?.response?.data?.message || 'Une erreur est survenue.',
                confirmButtonColor: '#d33',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEdit = () => {
        if (!user) return;

        setContactValue(user.contact || '');
        setIsEditingContact(false);
    };

    const handleSaveBranch = async () => {
        if (!user) return;

        if (branchValue === user.branch) {
            setIsEditingBranch(false);
            return;
        }

        setIsSaving(true);

        try {
            await updateCurrentUser({ branch: branchValue });

            await refreshUser();

            Swal.fire({
                icon: 'success',
                title: 'Modification enregistrée',
                text: 'Votre filière a été mise à jour avec succès.',
                confirmButtonColor: '#16a34a',
            });

            setIsEditingBranch(false);
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error?.response?.data?.message || 'Une erreur est survenue.',
                confirmButtonColor: '#d33',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelEditBranch = () => {
        if (!user) return;

        setBranchValue(user.branch || '');
        setIsEditingBranch(false);
    };

    if (userLoading || !user) return null;

    return (
        <Card className="w-full max-w-6xl mx-auto overflow-hidden border-0 shadow-md pt-0">
            <CardHeader className="relative overflow-hidden border-b bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 p-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_40%)]" />

                <div className="relative flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-start">
                    <div className="flex items-center gap-5">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold text-white shadow-inner ring-1 ring-white/20 backdrop-blur">
                            {getInitials()}
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-2xl font-bold text-white md:text-3xl">
                                    {user.firstName} {user.lastName}
                                </h2>

                                <span
                                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getPermissionStyle(
                                        user.permission,
                                    )}`}>
                                    {user.permission}
                                </span>
                            </div>

                            <p className="mt-1 truncate text-sm text-slate-300">{user.email}</p>

                            <p className="mt-2 text-xs text-slate-400">ID utilisateur : {user.userId}</p>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-8 p-5 md:p-7">
                <p>
                    Les informations ci-dessous sont en partie modifiables par vos soins.
                    <br />
                    Pour toute autre demande de modification, veuillez envoyer un email à l'adresse{' '}
                    <a href="mailto:integration+site-support@utt.fr" className="text-blue-500 hover:text-blue-700">
                        integration+site-support@utt.fr
                    </a>
                    , nous vous répondrons dans les meilleurs délais.
                </p>

                <section>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
                        <p className="text-sm text-gray-500">Vos informations de profil.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                                Prénom
                            </label>
                            <Input value={user.firstName || ''} disabled placeholder="Prénom" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                                Nom
                            </label>
                            <Input value={user.lastName || ''} disabled placeholder="Nom" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="contact" className="text-sm font-medium text-gray-700">
                                    Comment te contacter ?
                                </label>

                                {!isEditingContact && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingContact(true)}
                                        className="text-sm font-medium text-blue-600 transition hover:text-blue-800">
                                        ✏️ Modifier
                                    </button>
                                )}
                            </div>

                            {!isEditingContact ? (
                                <Input value={user.contact || ''} disabled placeholder="Contact" />
                            ) : (
                                <div className="space-y-2">
                                    <Input
                                        value={contactValue}
                                        onChange={(e) => setContactValue(e.target.value)}
                                        placeholder="Votre contact"
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            onClick={handleSaveContact}
                                            disabled={isSaving}
                                            className="bg-blue-600 text-white hover:bg-blue-700">
                                            {isSaving ? '🔄 Enregistrement...' : '✅ Enregistrer'}
                                        </Button>

                                        <Button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            disabled={isSaving}
                                            className="bg-gray-500 text-white hover:bg-gray-600">
                                            Annuler
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="gender" className="text-sm font-medium text-gray-700">
                                Genre
                            </label>
                            <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                                {user.male === true ? 'Homme' : user.male === false ? 'Femme' : 'Non renseigné'}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-t pt-7">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Formation</h3>
                        <p className="text-sm text-gray-500">Vos informations académiques.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="branch" className="text-sm font-medium text-gray-700">
                                    Filière
                                </label>

                                {user.permission !== 'Nouveau' && !isEditingBranch && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingBranch(true)}
                                        className="text-sm font-medium text-blue-600 transition hover:text-blue-800">
                                        ✏️ Modifier
                                    </button>
                                )}
                            </div>

                            {!isEditingBranch ? (
                                <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                                    {user.branch || 'Non renseignée'}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Select
                                        inputId="branch"
                                        value={branchOptions.find((b) => b.value === branchValue) || null}
                                        onChange={(option: SingleValue<BranchOption>) => {
                                            setBranchValue(option?.value || '');
                                        }}
                                        options={branchOptions}
                                        placeholder="Choisir une filière"
                                        isClearable
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            onClick={handleSaveBranch}
                                            disabled={isSaving}
                                            className="bg-blue-600 text-white hover:bg-blue-700">
                                            {isSaving ? '🔄 Enregistrement...' : '✅ Enregistrer'}
                                        </Button>

                                        <Button
                                            type="button"
                                            onClick={handleCancelEditBranch}
                                            disabled={isSaving}
                                            className="bg-gray-500 text-white hover:bg-gray-600">
                                            Annuler
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="majeur" className="text-sm font-medium text-gray-700">
                                Statut de majorité
                            </label>
                            <div className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                                {user.majeur === true ? 'Majeur' : user.majeur === false ? 'Mineur' : 'Non renseigné'}
                            </div>
                        </div>
                    </div>
                </section>
            </CardContent>
        </Card>
    );
};

export default ProfileCard;
