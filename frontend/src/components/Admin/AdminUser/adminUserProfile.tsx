import { useEffect, useState } from 'react';
import Select from 'react-select';
import { type SingleValue } from 'react-select';
import Swal from 'sweetalert2';

import type { User, UserWithMakerBattle, UserWithTeamInfo } from '../../../interfaces/user.interface';
import {
    branchOptions,
    type GenderOption,
    genderOptions,
    majorOptions,
    permissionOptions,
} from '../../../interfaces/user.interface';
import { checkBannedEmail } from '../../../services/requests/banned.service';
import { deleteUserByAdmin, getUsersAdmin, updateUserByAdmin } from '../../../services/requests/user.service';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import AdminUserProfileCardHeader from './AdminUserProfile/adminUserProfileCardHeader';
import AdminUserProfileEmergencyContact from './AdminUserProfile/adminUserProfileEmergencyContact';
import AdminUserProfileMakerBattle from './AdminUserProfile/adminUserProfileMakerBattle';
import AdminUserProfileOnboardingStatus from './AdminUserProfile/adminUserProfileOnboardingStatus';
import AdminUserProfileSelect from './AdminUserProfile/adminUserProfileSelect';
import AdminUserProfileTeam from './AdminUserProfile/adminUserProfileTeam';

const AdminUserProfile = () => {
    const [users, setUsers] = useState<UserWithTeamInfo[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserWithTeamInfo | null>(null);
    const [formData, setFormData] = useState<Partial<UserWithMakerBattle>>({});

    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);

    const isUttEmail = selectedUser?.email.toLowerCase().endsWith('@utt.fr') ?? false;

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await getUsersAdmin();
            setUsers(res);
        };

        fetchUsers();
    }, []);

    const handleUserSelect = async (option: any) => {
        const user = users.find((u) => u.userId === option.value);

        if (user) {
            setSelectedUser(user);
            setFormData({ ...user });
            setIsEditingEmail(false);
            setNewEmail(user.email);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSelectChange = (field: keyof User) => (option: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: option?.value ?? null,
        }));
    };

    const handleSave = async () => {
        if (!selectedUser) return;

        try {
            const response = await updateUserByAdmin(selectedUser.userId, formData);

            setSelectedUser((prev) =>
                prev
                    ? {
                          ...prev,
                          ...formData,
                      }
                    : prev,
            );

            setUsers((prev) =>
                prev.map((user) =>
                    user.userId === selectedUser.userId
                        ? {
                              ...user,
                              ...formData,
                          }
                        : user,
                ),
            );

            Swal.fire({
                icon: 'success',
                title: 'Utilisateur mis à jour',
                text: response.message,
                confirmButtonColor: '#16a34a',
            });
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error?.response?.data?.message || 'Une erreur est survenue lors de la mise à jour.',
                confirmButtonColor: '#d33',
            });
        }
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
                title: 'Utilisateur supprimé',
                text: response.message,
                confirmButtonColor: '#16a34a',
            });
        }
    };

    const handleEmailModificationClick = () => {
        if (!selectedUser) return;

        if (isUttEmail) {
            Swal.fire({
                icon: 'warning',
                title: 'Email protégé',
                text: 'Les emails @utt.fr ne peuvent pas être modifiés.',
                confirmButtonColor: '#f59e0b',
            });
            return;
        }

        setIsEditingEmail(true);
        setNewEmail(selectedUser.email);
    };

    const handleCancelEmailModification = () => {
        setIsEditingEmail(false);
        setNewEmail(selectedUser?.email || '');
    };

    const handleConfirmEmailModification = async () => {
        if (!selectedUser || !newEmail) return;

        const normalizedEmail = newEmail.trim().toLowerCase();

        if (normalizedEmail.endsWith('@utt.fr')) {
            Swal.fire({
                icon: 'error',
                title: 'Email invalide',
                text: 'Impossible de modifier vers un email @utt.fr',
                confirmButtonColor: '#d33',
            });

            return;
        }

        if (normalizedEmail === selectedUser.email.toLowerCase()) {
            Swal.fire({
                icon: 'warning',
                title: 'Email identique',
                text: "Le nouvel email est identique à l'ancien.",
                confirmButtonColor: '#f59e0b',
            });

            return;
        }

        setIsCheckingEmail(true);

        try {
            const isBanned = await checkBannedEmail(normalizedEmail);

            if (isBanned) {
                Swal.fire({
                    icon: 'error',
                    title: 'Email banni',
                    text: 'Cet email est actuellement banni du système.',
                    confirmButtonColor: '#d33',
                });

                return;
            }

            const result = await Swal.fire({
                title: "⚠️ Modification d'email",
                html: `
                    <div class="text-left space-y-2">
                        <p><strong>Ancien email :</strong> ${selectedUser.email}</p>
                        <p><strong>Nouvel email :</strong> ${normalizedEmail}</p>
                        <p class="text-red-600">
                            <strong>Attention :</strong> l'utilisateur devra utiliser cette nouvelle adresse
                            pour se connecter.
                        </p>
                    </div>
                `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#2563eb',
                cancelButtonColor: '#6b7280',
                confirmButtonText: "Oui, modifier l'email",
                cancelButtonText: 'Annuler',
            });

            if (!result.isConfirmed) return;

            await updateUserByAdmin(selectedUser.userId, {
                email: normalizedEmail,
            });

            const updatedUser = {
                ...selectedUser,
                email: normalizedEmail,
            };

            setSelectedUser(updatedUser);
            setFormData((prev) => ({
                ...prev,
                email: normalizedEmail,
            }));

            setUsers((prev) => prev.map((user) => (user.userId === selectedUser.userId ? updatedUser : user)));

            setIsEditingEmail(false);

            Swal.fire({
                icon: 'success',
                title: 'Email modifié',
                text: `L'utilisateur devra désormais utiliser ${normalizedEmail} pour se connecter.`,
                confirmButtonColor: '#16a34a',
            });
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text:
                    error?.response?.data?.msg ||
                    error?.response?.data?.message ||
                    "Une erreur est survenue lors de la modification de l'email.",
                confirmButtonColor: '#d33',
            });
        } finally {
            setIsCheckingEmail(false);
        }
    };

    return (
        <div className="w-full space-y-6">
            <AdminUserProfileSelect users={users} handleUserSelect={handleUserSelect} />

            {selectedUser && (
                <Card className="w-full max-w-6xl mx-auto overflow-hidden border-0 shadow-md  pt-0">
                    <AdminUserProfileCardHeader selectedUser={selectedUser} isUttEmail={isUttEmail} />
                    <CardContent className="space-y-8 p-5 md:p-7">
                        <section>
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
                                <p className="text-sm text-gray-500">Informations générales du compte utilisateur.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                                        Prénom
                                    </label>

                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName || ''}
                                        onChange={handleInputChange}
                                        placeholder="Prénom"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                                        Nom
                                    </label>

                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName || ''}
                                        onChange={handleInputChange}
                                        placeholder="Nom"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="contact" className="text-sm font-medium text-gray-700">
                                        Contact fourni par l'utilisateur
                                    </label>

                                    <Input
                                        id="contact"
                                        name="contact"
                                        value={formData.contact || ''}
                                        onChange={handleInputChange}
                                        placeholder="Contact"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="male" className="text-sm font-medium text-gray-700">
                                        Sexe/Genre
                                    </label>

                                    <Select
                                        options={genderOptions}
                                        value={
                                            formData.male !== undefined && formData.male !== null
                                                ? genderOptions.find((opt) => opt.value === formData.male)
                                                : null
                                        }
                                        onChange={(option: SingleValue<GenderOption>) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                male: option?.value ?? null,
                                            }));
                                        }}
                                        placeholder="Sélectionner..."
                                        isClearable
                                        styles={{
                                            control: (baseStyles, state) => ({
                                                ...baseStyles,
                                                backgroundColor:
                                                    !state.hasValue && formData.permission === 'Nouveau'
                                                        ? 'var(--color-red-200)'
                                                        : '',
                                                borderColor:
                                                    !state.hasValue && formData.permission === 'Nouveau'
                                                        ? 'var(--color-red-800)'
                                                        : '',
                                            }),
                                        }}></Select>

                                    {(formData.male === null || formData.male === undefined) &&
                                        selectedUser?.permission === 'Nouveau' && (
                                            <p className="text-xs font-medium text-red-600">
                                                ⚠️ Attention, les nouveaux sans genre renseigné ne seront pas répartis
                                                dans les équipes.
                                            </p>
                                        )}
                                </div>
                            </div>
                        </section>

                        <section className="border-t pt-7">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Compte et accès</h3>

                                <p className="text-sm text-gray-500">
                                    Gestion de l'adresse email et des droits d'accès.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                            Adresse email
                                        </label>

                                        {!selectedUser.email.toLowerCase().endsWith('@utt.fr') && !isEditingEmail && (
                                            <button
                                                type="button"
                                                onClick={handleEmailModificationClick}
                                                className="text-sm font-medium text-blue-600 transition hover:text-blue-800">
                                                ✏️ Modifier
                                            </button>
                                        )}
                                    </div>

                                    {!isEditingEmail ? (
                                        <Input
                                            id="email"
                                            name="email"
                                            value={selectedUser.email}
                                            disabled
                                            placeholder="Email"
                                        />
                                    ) : (
                                        <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-4">
                                            <div className="mb-3">
                                                <p className="text-sm font-semibold text-yellow-900">
                                                    ⚠️ Modification de l'adresse email
                                                </p>

                                                <p className="mt-1 text-xs leading-relaxed text-yellow-800">
                                                    L'utilisateur devra utiliser cette nouvelle adresse pour se
                                                    connecter.
                                                </p>
                                            </div>

                                            <Input
                                                type="email"
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                                placeholder="Nouvelle adresse email"
                                            />

                                            <div className="mt-3 flex gap-2">
                                                <Button
                                                    type="button"
                                                    onClick={handleConfirmEmailModification}
                                                    disabled={isCheckingEmail}
                                                    className="bg-blue-600 text-white hover:bg-blue-700">
                                                    {isCheckingEmail ? '🔄 Vérification...' : '✅ Confirmer'}
                                                </Button>

                                                <Button
                                                    type="button"
                                                    onClick={handleCancelEmailModification}
                                                    disabled={isCheckingEmail}
                                                    className="bg-gray-500 text-white hover:bg-gray-600">
                                                    Annuler
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {selectedUser.email.toLowerCase().endsWith('@utt.fr') && (
                                        <p className="text-xs font-medium text-red-600">
                                            ⛔ L'adresse institutionnelle ne peut pas être modifiée.
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="permission" className="text-sm font-medium text-gray-700">
                                        Permission
                                    </label>

                                    <Select
                                        placeholder="Permission"
                                        options={permissionOptions}
                                        value={
                                            permissionOptions.find((opt) => opt.value === formData.permission) || null
                                        }
                                        onChange={handleSelectChange('permission')}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="border-t pt-7">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Formation</h3>

                                <p className="text-sm text-gray-500">
                                    Filière et statut de majorité renseignés pour l'utilisateur.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="branch" className="text-sm font-medium text-gray-700">
                                        Filière
                                    </label>

                                    <Select
                                        value={branchOptions.find((b) => b.value === formData.branch) || null}
                                        onChange={handleSelectChange('branch')}
                                        options={branchOptions}
                                        placeholder="Choisir une filière"
                                        isClearable
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="majeur" className="text-sm font-medium text-gray-700">
                                        Statut de majorité
                                    </label>

                                    <Select
                                        placeholder="Majeur ?"
                                        options={majorOptions}
                                        value={majorOptions.find((opt) => opt.value === formData.majeur) || null}
                                        onChange={handleSelectChange('majeur')}
                                    />

                                    <p className="text-xs text-orange-700">
                                        ⚠️ Cette donnée correspond à la date choisie lors de l'import SIEP.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {selectedUser.permission === 'Nouveau' && (
                            <>
                                <AdminUserProfileOnboardingStatus selectedUser={selectedUser} />
                                <AdminUserProfileTeam selectedUser={selectedUser} />
                                <AdminUserProfileEmergencyContact selectedUser={selectedUser} />
                                <AdminUserProfileMakerBattle selectedUser={selectedUser} />
                            </>
                        )}

                        <section className="border-t pt-7">
                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <Button
                                    type="button"
                                    onClick={handleDelete}
                                    className="bg-red-600 text-white hover:bg-red-700">
                                    🗑 Supprimer l'utilisateur
                                </Button>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Button
                                        type="button"
                                        onClick={handleSave}
                                        className="bg-green-600 text-white hover:bg-green-700">
                                        💾 Enregistrer les modifications
                                    </Button>
                                </div>
                            </div>
                        </section>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AdminUserProfile;
