import { useEffect, useState } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';

import { type User } from '../../interfaces/user.interface';
import { emailPreview, sendEmail } from '../../services/requests/email.service';
import { getUsers } from '../../services/requests/user.service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { HorizontalMultipleSelect } from '../ui/horizontalMultipleSelect';
import { HorizontalSingleSelect } from '../ui/horizontalSingleSelect';
import { Input } from '../ui/input';

type SelectOption = {
    value: string;
    label: string;
};

export const AdminEmail = () => {
    const [subject, setSubject] = useState('');
    const [templateName, setTemplateName] = useState('custom');
    const [format] = useState<'html' | 'txt'>('html');
    const [customTitle, setCustomTitle] = useState('');
    const [customContent, setCustomContent] = useState('');
    const [recipientsGroups, setRecipientsGroups] = useState<string[]>([]);
    const [sendTo, setSendTo] = useState<SelectOption[]>([]);
    const [preview, setPreview] = useState('');
    const [users, setUsers] = useState<User[]>([]);

    const recipientsOptions = [
        { name: 'Nouveau', value: 'Nouveau' },
        { name: 'CE', value: 'Student' },
        { name: 'RespoCE', value: 'RespoCE' },
        { name: 'Admin', value: 'Admin' },
    ];

    const templateOptions = [
        { name: 'Personnalisé', value: 'custom' },
        { name: 'Welcome', value: 'templateWelcome' },
        { name: 'Cahier de Vacances', value: 'templateNotebook' },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setPreview('');
    }, [templateName, customTitle, customContent]);

    const isCustom = () => templateName === 'custom';

    const fetchData = async () => {
        try {
            const usersRes = await getUsers();
            setUsers(usersRes);
        } catch (err) {
            console.error('Erreur lors du chargement des données', err);
        }
    };

    const handlePreview = async () => {
        try {
            if (isCustom()) {
                const html = await emailPreview({
                    templateName: 'custom',
                    title: customTitle || subject,
                    content: customContent,
                });
                setPreview(html);
            } else {
                const html = await emailPreview({ templateName });
                setPreview(html);
            }
        } catch {
            alert('Erreur dans les données JSON');
        }
    };

    const handleSend = async () => {
        const emails = sendTo.map((u) => u.value);

        const payload = {
            subject,
            templateName: isCustom() ? 'custom' : templateName,
            format,
            recipientsGroups,
            sendTo: recipientsGroups.length ? null : emails,
            title: isCustom() ? customTitle || subject : undefined,
            content: isCustom() ? customContent : undefined,
            html: isCustom() ? customContent : undefined,
        };

        try {
            const res = await sendEmail(payload);
            Swal.fire({
                icon: 'success',
                title: 'Email envoyé',
                text: res.message,
            });
        } catch (error) {
            Swal.fire({
                title: 'Erreur ❌',
                text: error?.response?.data?.message || 'Une erreur est survenue.',
                icon: 'error',
            });
        }
    };

    const confirmSend = async () => {
        if (!subject) {
            Swal.fire({
                title: 'Objet vide',
                text: "Impossible d'envoyer un email sans objet.",
                icon: 'error',
            });
            return;
        }

        const result = await Swal.fire({
            title: "Confirmer l'envoi",
            text: 'Êtes-vous sûr de vouloir envoyer cet email ?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, envoyer',
            cancelButtonText: 'Annuler',
        });

        if (result.isConfirmed) {
            await handleSend();
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">📬 Envoi d'e-mail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Contenu:</h3>

                <p>Sujet:</p>
                <Input
                    placeholder="[ENGLISH BELOW] Intégration UTT - Nouveautées !"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />

                <HorizontalSingleSelect options={templateOptions} value={templateName} setValue={setTemplateName} />

                {isCustom() && (
                    <>
                        <Input
                            placeholder="Titre du mail"
                            value={customTitle}
                            onChange={(e) => setCustomTitle(e.target.value)}
                        />
                        <textarea
                            placeholder="Contenu HTML de l'email"
                            value={customContent}
                            onChange={(e) => setCustomContent(e.target.value)}
                            className="w-full h-40 p-2 border rounded"
                        />
                    </>
                )}

                <div className="flex justify-end">
                    <Button onClick={handlePreview} className="align-right" variant={'outline'}>
                        Afficher un aperçu
                    </Button>
                </div>

                {preview && (
                    <div className="border p-4 rounded bg-gray-50" dangerouslySetInnerHTML={{ __html: preview }}></div>
                )}

                <h3 className="text-xl font-semibold text-gray-700 mb-4">Destinataires:</h3>

                {!sendTo.length && (
                    <>
                        <p>Groupes:</p>
                        <HorizontalMultipleSelect
                            options={recipientsOptions}
                            value={recipientsGroups}
                            setValue={setRecipientsGroups}
                        />
                    </>
                )}

                {!recipientsGroups?.length && (
                    <>
                        <p>Utilisateurs:</p>
                        <Select
                            isMulti
                            options={users.map((u) => ({
                                value: u.email,
                                label: `${u.firstName} ${u.lastName}`,
                            }))}
                            onChange={(val) => setSendTo((val ?? []) as SelectOption[])}
                        />
                    </>
                )}
                <Button onClick={confirmSend} size={'lg'}>
                    ✉️ Envoyer
                </Button>
            </CardContent>
        </Card>
    );
};
