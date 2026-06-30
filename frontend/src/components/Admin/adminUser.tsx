import { useEffect, useState } from 'react';
import Select from 'react-select';
import { type SingleValue } from 'react-select';
import Swal from 'sweetalert2';

import { type User } from '../../interfaces/user.interface';
import { renewTokenUser, requestPasswordUser } from '../../services/requests/auth.service';
import {
    createUserByAdmin,
    deleteUserByAdmin,
    getUsersAdmin,
    syncnewStudent,
    updateUserByAdmin,
} from '../../services/requests/user.service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';

const permissionOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Student', label: 'Étudiant' },
    { value: 'Nouveau', label: 'Nouveau' },
];

const branchOptions = [
    { value: 'TC', label: 'Tronc Commun' },
    { value: 'RT', label: 'Réseaux et Télécommunications' },
    { value: 'ISI', label: "Informatique et Systèmes d'Information" },
    { value: 'GM', label: 'Génie Mécanique' },
    { value: 'GI', label: 'Génie Industriel' },
    { value: 'MTE', label: 'Matériaux : Technologie et Économie' },
    { value: 'A2I', label: 'Automatique & Informatique Industrielle' },
    { value: 'GI_APPR', label: 'Génie Industriel en Apprentissage' },
    { value: 'GM_APPR', label: 'Génie Mécanique en Apprentissage' },
    { value: 'SN_APPR', label: 'Système Numérique en Apprentissage' },
    { value: 'Branch', label: 'Branche' },
    { value: 'MM', label: 'Mécanique et Matériaux' },
    { value: 'MA', label: 'Master' },
    { value: 'RI', label: 'Ressources Internationales' },
];

const majeurOptions = [
    { value: true, label: 'Majeur' },
    { value: false, label: 'Mineur' },
];

type BranchOption = (typeof branchOptions)[number];

type MajorOption = (typeof majeurOptions)[number];

export const AdminUser = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<Partial<User>>({});

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await getUsersAdmin();
            setUsers(res);
        };
        fetchUsers();
    }, []);

    const handleUserSelect = (option: any) => {
        const user = users.find((u) => u.userId === option.value);
        if (user) {
            setSelectedUser(user);
            setFormData({ ...user });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectChange = (field: keyof User) => (option: any) => {
        setFormData((prev) => ({ ...prev, [field]: option?.value ?? null }));
    };

    const handleSave = async () => {
        if (!selectedUser) return;
        const response = await updateUserByAdmin(selectedUser.userId, formData);

        Swal.fire({
            icon: 'success',
            title: 'Utilisateur mis à jour',
            text: response.message,
            confirmButtonColor: '#16a34a',
        });
    };

    const handleDelete = async () => {
        if (!selectedUser) return;

        const result = await Swal.fire({
            title: `Supprimer ${selectedUser.firstName} ${selectedUser.lastName} ?`,
            text: 'Cette action est irréversible !',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
        });

        if (result.isConfirmed) {
            const response = await deleteUserByAdmin(selectedUser.userId);
            setUsers((prev) => prev.filter((u) => u.userId !== selectedUser.userId));
            setSelectedUser(null);
            setFormData({});

            Swal.fire({
                icon: 'success',
                title: 'Supprimé',
                text: response.message,
                confirmButtonColor: '#16a34a',
            });
        }
    };

    const handleRenewToken = async () => {
        if (!selectedUser) return;

        const result = await Swal.fire({
            title: `Renouveler le token de ${selectedUser.firstName} ${selectedUser.lastName} ?`,
            text: 'Un nouveau token sera généré.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, renouveler',
            cancelButtonText: 'Annuler',
        });

        if (result.isConfirmed) {
            const res = await renewTokenUser(selectedUser.userId);

            Swal.fire({
                icon: 'success',
                title: 'Token renouvelé 🔑',
                text: res.message,
                confirmButtonColor: '#16a34a',
            });
        }
    };

    const handleRequestPassword = async () => {
        if (!selectedUser) return;

        const result = await Swal.fire({
            title: `Envoyer une demande de reset password à ${selectedUser.email} ?`,
            text: "L'utilisateur recevra un email pour réinitialiser son mot de passe.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, envoyer',
            cancelButtonText: 'Annuler',
        });

        if (result.isConfirmed) {
            const res = await requestPasswordUser(selectedUser.email);

            Swal.fire({
                icon: 'success',
                title: 'Email envoyé 📩',
                text: res.msg,
                confirmButtonColor: '#16a34a',
            });
        }
    };

    return (
        <Card className="w-full max-w-7xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    👤 Gérer un utilisateur
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <Select
                    placeholder="Sélectionner un utilisateur"
                    options={users.map((u) => ({
                        value: u.userId,
                        label: `${u.firstName} ${u.lastName} (${u.email})`,
                    }))}
                    onChange={handleUserSelect}
                />

                {selectedUser && (
                    <form className="space-y-3 mt-4">
                        <Input
                            name="firstName"
                            value={formData.firstName || ''}
                            onChange={handleInputChange}
                            placeholder="Prénom"
                        />
                        <Input
                            name="lastName"
                            value={formData.lastName || ''}
                            onChange={handleInputChange}
                            placeholder="Nom"
                        />
                        <Input name="email" value={formData.email || ''} disabled placeholder="Email" />

                        <p className="text-sm text-red-500 underline mt-2">
                            <strong>Attention : la donnée récupérée dépend de la date de synchro choisie</strong>
                        </p>

                        <Select
                            placeholder="Majeur ?"
                            options={majeurOptions}
                            value={majeurOptions.find((opt) => opt.value === formData.majeur) || null}
                            onChange={handleSelectChange('majeur')}
                            isClearable
                        />

                        <Select
                            value={branchOptions.find((b) => b.value === formData.branch) || null}
                            onChange={handleSelectChange('branch')}
                            options={branchOptions}
                            placeholder="Choisir une filière"
                            isClearable
                        />

                        <Input
                            name="contact"
                            value={formData.contact || ''}
                            onChange={handleInputChange}
                            placeholder="Contact"
                        />

                        <Select
                            placeholder="Permission"
                            options={permissionOptions}
                            value={permissionOptions.find((opt) => opt.value === formData.permission) || null}
                            onChange={handleSelectChange('permission')}
                            isClearable
                        />

                        <div className="flex gap-4 mt-4">
                            <Button
                                type="button"
                                onClick={handleSave}
                                className="bg-green-600 hover:bg-green-700 text-white">
                                💾 Sauvegarder
                            </Button>
                            <Button
                                type="button"
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white">
                                🗑 Supprimer
                            </Button>
                            <Button
                                type="button"
                                onClick={handleRenewToken}
                                className="bg-blue-500 hover:bg-blue-600 text-white">
                                🔄 Reset Token
                            </Button>
                            <Button
                                type="button"
                                onClick={handleRequestPassword}
                                className="bg-purple-500 hover:bg-purple-600 text-white">
                                📧 Reset Password (mail)
                            </Button>
                        </div>
                    </form>
                )}
            </CardContent>
        </Card>
    );
};

export const AdminSyncNewStudent = () => {
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('');

    const handleSync = async () => {
        setLoading(true);

        try {
            let formattedDate = '';
            if (selectedDate) {
                const [year, month, day] = selectedDate.split('-');
                formattedDate = `${year}.${month}${day}`;
            }

            const response = await syncnewStudent(formattedDate);

            Swal.fire({
                icon: 'success',
                title: 'Synchronisation réussie',
                text: response.message,
                confirmButtonColor: '#2563eb',
            });
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Erreur lors de la tentative de connexion.',
                confirmButtonColor: '#d33',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-7xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">🔄 Synchro API SIEP</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <label htmlFor="date" className="block text-gray-700 font-medium">
                    Choisir une date de vérification de majorité :
                </label>
                <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <div className="flex justify-center">
                    <Button
                        onClick={handleSync}
                        disabled={loading || !selectedDate}
                        className="bg-blue-500 text-white hover:bg-blue-600 p-3 rounded-lg shadow">
                        {loading ? 'Chargement...' : '🚀 Lancer la synchro'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export const AdminRegisterNewStudent = () => {
    const [newFirstName, setNewFirstName] = useState<string>('');
    const [newLastName, setNewLastName] = useState<string>('');
    const [newEmail, setNewEmail] = useState<string>('');
    const [newMajorState, setNewMajorState] = useState<MajorOption | null>(null);
    const [newBranch, setNewBranch] = useState<BranchOption | null>(null);

    const handleSave = async ({ withNotification = true } = {}) => {
        if (!newFirstName || !newLastName || !newEmail || !newMajorState || !newBranch) {
            Swal.fire({
                title: 'Champs vides',
                text: "L'ensemble des champs sont nécessaires.",
                icon: 'error',
            });
            return;
        }

        const response = await createUserByAdmin({
            firstName: newFirstName,
            lastName: newLastName,
            email: newEmail.toLowerCase(),
            major: newMajorState.value,
            branch: newBranch.value,
            withNotification,
        });

        Swal.fire({
            icon: 'success',
            title: 'Utilisateur mis à jour',
            text: response.message,
            confirmButtonColor: '#16a34a',
        });
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    ➕ Nouvel Utilisateur
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <form className="space-y-3 mt-4">
                    <p>
                        Ce formulaire permet de créer <b>uniquement un compte Nouveau</b>.
                        <br />
                        Pour les CE, Organisateurs, Admins, il suffit à la personne de se connecter via le CAS pour
                        créer son compte.
                    </p>

                    <Input
                        name="firstName"
                        value={newFirstName}
                        onChange={(e) => setNewFirstName(e.target.value)}
                        placeholder="Prénom"
                    />
                    <Input
                        name="lastName"
                        value={newLastName}
                        onChange={(e) => setNewLastName(e.target.value)}
                        placeholder="Nom"
                    />
                    <Input
                        name="email"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="Email"
                    />

                    <p className="text-sm text-red-500 underline mt-2">
                        <strong>Attention : Renseigner l'état de majorité le jour de la SDI.</strong>
                    </p>

                    <Select
                        placeholder="Majeur ?"
                        options={majeurOptions}
                        value={newMajorState}
                        onChange={(value: SingleValue<MajorOption>) => setNewMajorState(value)}
                    />

                    <Select
                        placeholder="Choisir une filière"
                        options={branchOptions}
                        value={newBranch}
                        onChange={(value: SingleValue<BranchOption>) => setNewBranch(value)}
                    />

                    <div className="flex gap-4 mt-4">
                        <Button
                            type="button"
                            onClick={() => handleSave()}
                            className="bg-green-600 hover:bg-green-700 text-white">
                            💾 Enregistrer et envoyer mail Welcome
                        </Button>
                        <Button
                            type="button"
                            variant={'outline'}
                            onClick={() => handleSave({ withNotification: false })}>
                            Enregistrer silencieusement
                        </Button>
                    </div>
                    <div className="text-gray-500">
                        Détail des options:
                        <ul className="list-disc pl-5">
                            <li>
                                Le bouton <i>Enregistrer et envoyer mail Welcome</i> permet d'enregistrer l'utilisateur
                                sur le site, puis envoi immédiatement un mail présentant l'intégration et permettant de
                                créer son mot de passe pour accéder au site.
                            </li>
                            <li>
                                Le bouton <i>Enregistrer silencieusement</i> permet d'enregistrer l'utilisateur sur le
                                site, mais n'envoi aucun mail.
                            </li>
                        </ul>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
