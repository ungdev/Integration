import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import type { UserWithTeamInfo } from '../../../../interfaces/user.interface';
import { renewTokenUser, requestPasswordUser } from '../../../../services/requests/auth.service';
import { Button } from '../../../ui/button';
import { CardHeader } from '../../../ui/card';

type AdminUserProfileCardHeaderProps = {
    selectedUser: UserWithTeamInfo;
    isUttEmail: boolean;
};

const AdminUserProfileCardHeader = ({ selectedUser, isUttEmail }: AdminUserProfileCardHeaderProps) => {
    const navigate = useNavigate();

    const getInitials = () => {
        if (!selectedUser) return '?';

        return `${selectedUser.firstName?.[0] || ''}${selectedUser.lastName?.[0] || ''}`.toUpperCase();
    };

    const getPermissionStyle = (permission?: string) => {
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

    const handleRenewToken = async () => {
        if (!selectedUser) return;

        const result = await Swal.fire({
            title: `Renouveler le token de ${selectedUser.firstName} ${selectedUser.lastName} ?`,
            text: 'Un nouveau token sera généré, l\'ancien ne sera plus valide. Il faudra le communiquer manuellement à l\'utilisateur. Pour un envoi automatique, utilisez le bouton "Mail Welcome".',
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

    const handleSendWelcomeMail = async () => {
        if (!selectedUser) return;

        const result = await Swal.fire({
            title: `Envoyer un mail Welcome à ${selectedUser.firstName} ${selectedUser.lastName} ?`,
            text: `L'utilisateur ${selectedUser.email} recevra un email de bienvenue avec un lien permettant de définir son mot de passe.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, envoyer',
            cancelButtonText: 'Annuler',
        });

        if (result.isConfirmed) {
            const emailParams = new URLSearchParams({
                subject: "[ENGLISH BELOW] - Bienvenue à l'UTT !",
                template: 'templateWelcome',
                email: selectedUser.email,
                firstName: selectedUser.firstName,
                lastName: selectedUser.lastName,
            });

            navigate(`/admin/email?${emailParams.toString()}`);
        }
    };

    const handleRequestPassword = async () => {
        if (!selectedUser) return;

        const result = await Swal.fire({
            title: `Envoyer un lien de réinitialisation à ${selectedUser.firstName} ${selectedUser.lastName} ?`,
            text: `L'utilisateur ${selectedUser.email} recevra un email pour réinitialiser son mot de passe.`,
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
        <CardHeader className="relative overflow-hidden border-b bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 p-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_40%)]" />

            <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-5">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold text-white shadow-inner ring-1 ring-white/20 backdrop-blur">
                        {getInitials()}
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-2xl font-bold text-white md:text-3xl">
                                {selectedUser.firstName} {selectedUser.lastName}
                            </h2>

                            <span
                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getPermissionStyle(
                                    selectedUser.permission,
                                )}`}>
                                {selectedUser.permission}
                            </span>
                        </div>

                        <p className="mt-1 truncate text-sm text-slate-300">{selectedUser.email}</p>

                        <p className="mt-2 text-xs text-slate-400">ID utilisateur : {selectedUser.userId}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Button
                        type="button"
                        disabled={isUttEmail}
                        onClick={handleRequestPassword}
                        className={`border border-white/20 text-white ${
                            isUttEmail ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-white/10 hover:bg-white/20'
                        }`}>
                        📧 Réinitialisation Mot de passe
                    </Button>
                    <Button
                        type="button"
                        disabled={isUttEmail}
                        onClick={handleRenewToken}
                        className={`border border-white/20 text-white ${
                            isUttEmail ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-white/10 hover:bg-white/20'
                        }`}>
                        🔄 Réinitialisation Token
                    </Button>
                    <Button
                        type="button"
                        disabled={isUttEmail}
                        onClick={handleSendWelcomeMail}
                        className={`text-white ${
                            isUttEmail ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-green-600 hover:bg-green-700'
                        }`}>
                        📧 Mail Welcome
                    </Button>
                </div>
            </div>
        </CardHeader>
    );
};

export default AdminUserProfileCardHeader;
