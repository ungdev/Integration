import { useState } from 'react';
import Select from 'react-select';
import { type SingleValue } from 'react-select';
import Swal from 'sweetalert2';

import { type BranchOption, branchOptions, type MajorOption, majorOptions } from '../../../interfaces/user.interface';
import { createUserByAdmin } from '../../../services/requests/user.service';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';

const AdminUserRegisterNewStudent = () => {
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

        try {
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
        } catch (error: any) {
            Swal.fire({
                title: 'Erreur ❌',
                text: error?.response?.data?.message || 'Une erreur est survenue.',
                icon: 'error',
            });
        }
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
                        options={majorOptions}
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

export default AdminUserRegisterNewStudent;
