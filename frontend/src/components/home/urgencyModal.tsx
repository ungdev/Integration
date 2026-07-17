import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { createUserContactInformation } from '../../services/requests/user.service';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Modal from '../ui/modal';

function UrgencyModal() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [form, setForm] = useState({ urgency_contact_name: '', urgency_contact_phone: '' });

    const isLogin = searchParams.get('login') === 'true';

    return (
        <Modal title="Formulaire VSS et Urgence" visible={isLogin} onCancel={() => setSearchParams({})} buttons={null}>
            <div className="flex flex-col gap-4">
                <p>Bienvenu sur le site de l'intégration, blablabla faut que tu completes le formulaire.</p>
                <Input
                    placeholder="Nom du contact d'urgence"
                    value={form.urgency_contact_name}
                    onChange={(e) => setForm({ ...form, urgency_contact_name: e.target.value })}
                />
                <Input
                    placeholder="Téléphone du contact d'urgence"
                    value={form.urgency_contact_phone}
                    onChange={(e) => setForm({ ...form, urgency_contact_phone: e.target.value })}
                />
                <Button
                    onClick={() => {
                        createUserContactInformation(form);
                        setSearchParams({});
                    }}>
                    Soumettre
                </Button>
            </div>
        </Modal>
    );
}

export default UrgencyModal;
