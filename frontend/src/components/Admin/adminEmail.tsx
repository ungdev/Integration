import { useEffect, useState } from 'react';
import Select from 'react-select';
import { emailPreview, sendEmail } from '../../services/requests/email.service';
import { Card } from '../../styles/components/ui/card';
import { Button } from '../../styles/components/ui/button';
import { Input } from '../../styles/components/ui/input';
import { User } from 'src/interfaces/user.interface';
import { getUsers } from 'src/services/requests/user.service';

export const AdminEmail = () => {

  const [subject, setSubject] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [format, setFormat] = useState<'html' | 'txt'>('html');
  const [permission, setPermission] = useState<string | null>(null);
  const [sendTo, setSendTo] = useState<any[]>([]);
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
    { value: 'templateAttributionBus', label: 'Template Bus' },
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
      const html = await emailPreview(templateName);
      setPreview(html);
    } catch (err) {
      alert('Erreur dans les données JSON');
    }
  };

  const handleSend = async () => {
    const payload = {
      subject,
      templateName,
      format,
      permission,
      sendTo: permission ? null : sendTo.map((u) => u.value),
    };
    const res = await sendEmail(payload);
    alert(res.message);
  };

  return (
    <Card className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">📬 Envoi d'e-mail</h2>
      <Input placeholder="Sujet" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <Select
        placeholder="Nom du template"
        isClearable
        options={templateOptions}
        onChange={(opt) => {
            if (opt) {
              setTemplateName(opt.value); // Si opt n'est pas null, on définit le template
            } else {
              setTemplateName(''); // Ou une autre valeur par défaut si opt est null
            }}}
      />
      <Button onClick={handlePreview}>👁️ Aperçu</Button>
      {preview && (
        <div><div className="border p-4 rounded bg-gray-50" dangerouslySetInnerHTML={{ __html: preview }}></div></div>
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
          onChange={(val) => setSendTo(val as any)}
        />
      )}
      <Button onClick={handleSend} className="bg-blue-600 text-white">
        ✉️ Envoyer
      </Button>
    </Card>
  );
};