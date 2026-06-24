import { useEffect, useState } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';

import { type User } from '../../interfaces/user.interface';
import { emailPreview, sendEmail } from '../../services/requests/email.service';
import { getUsers } from '../../services/requests/user.service';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from '../ui/input';

type SelectOption = {
    value: string;
    label: string;
};

export const AdminEmail = () => {
    const [subject, setSubject] = useState('');
    const [templateName, setTemplateName] = useState('');
    const [format] = useState<'html' | 'txt'>('html');
    const [isCustom, setIsCustom] = useState(false);
    const [customTitle, setCustomTitle] = useState('');
    const [customContent, setCustomContent] = useState('');
    const [permission, setPermission] = useState<string | null>(null);
    const [sendTo, setSendTo] = useState<SelectOption[]>([]);
    const [preview, setPreview] = useState('');
    const [users, setUsers] = useState<User[]>([]);

    const permissionOptions = [
        { value: 'Nouveau', label: 'Nouveau' },
        { value: 'RespoCE', label: 'RespoCE' },
        { value: 'Admin', label: 'Admin' },
        { value: 'Student', label: 'Student' },
    ];

    const templateOptions = [
        { value: 'templateWelcome', label: 'Template Welcome' },
        { value: 'templateNotebook', label: 'Template Cahier de Vacances' },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const usersRes = await getUsers();
            setUsers(usersRes);
        } catch (err) {
            console.error("Erreur lors du chargement des données", err);
        }
    };

    const handlePreview = async () => {
        try {
            if (isCustom) {
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
        // On mappe toujours pour avoir un tableau de string

        const emails = sendTo.map((u) => u.value);

        const payload = {
            subject,
            templateName: isCustom ? 'custom' : templateName,
            format,
            permission,
            sendTo: permission ? null : emails,
            title: isCustom ? customTitle || subject : undefined,
            content: isCustom ? customContent : undefined,
            html: isCustom ? customContent : undefined,
        };

        try {
            const res = await sendEmail(payload);
            Swal.fire({
                icon: 'success',
                title: 'Email envoyé',
                text: res.message,
            });
        } catch(error) {
            Swal.fire({
                title: "Erreur ❌",
                text: error?.response?.data?.message || "Une erreur est survenue.",
                icon: "error",
            });
        }
    };

    const confirmSend = async () => {
        const result = await Swal.fire({
            title: 'Confirmer l\'envoi',
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
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    📬 Envoi d'e-mail
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input placeholder="Sujet" value={subject} onChange={(e) => setSubject(e.target.value)} />
                <div className="flex items-center space-x-2">
                    <input
                        id="customEmailCheckbox"
                        type="checkbox"
                        checked={isCustom}
                        onChange={(e) => {
                            setIsCustom(e.target.checked);
                            if (e.target.checked) setTemplateName('');
                        }}
                    />
                    <label htmlFor="customEmailCheckbox">✏️ Rédiger un mail personnalisé</label>
                </div>
                {isCustom && (
                    <Input
                        placeholder="Titre du mail"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                    />
                )}
                {!isCustom ? (
                    <Select
                        placeholder="Nom du template"
                        isClearable
                        options={templateOptions}
                        onChange={(opt) => setTemplateName(opt?.value || '')}
                    />
                ) : (
                    <textarea
                        placeholder="Contenu HTML de l'email"
                        value={customContent}
                        onChange={(e) => setCustomContent(e.target.value)}
                        className="w-full h-40 p-2 border rounded"
                    />
                )}
                <Button onClick={handlePreview}>👁️ Aperçu</Button>
                {preview && (
                    <div className="border p-4 rounded bg-gray-50" dangerouslySetInnerHTML={{ __html: preview }}></div>
                )}
                <Select
                    placeholder="Permission (facultatif)"
                    isClearable
                    options={permissionOptions}
                    onChange={(opt) => setPermission(opt?.value || null)}
                />
                {!permission && (
                    <Select
                        isMulti
                        options={users.map((u) => ({ value: u.email, label: `${u.firstName} ${u.lastName}` }))}
                        onChange={(val) => setSendTo((val ?? []) as SelectOption[])}
                    />
                )}
                <Button onClick={confirmSend} className="bg-blue-600 text-white">
                    ✉️ Envoyer
                </Button>
            </CardContent>
        </Card>
    );
};
