import { useEffect, useRef, useState } from 'react';

import { AdminLayout } from '../../components/Admin/adminLayout';
import PermanenceActions from '../../components/Admin/AdminPerm/adminPermAction';
import PermanenceForm from '../../components/Admin/AdminPerm/adminPermForm';
import { ImportPermCSV } from '../../components/Admin/AdminPerm/adminPermImport';
import PermanenceList from '../../components/Admin/AdminPerm/adminPermList';
import { RevealSection } from '../../components/ui/revealSection';
import { type Permanence } from '../../interfaces/permanence.interface';
import { type User } from '../../interfaces/user.interface';
import { getAllPermanences } from '../../services/requests/permanence.service';
import { getUsersAdmin } from '../../services/requests/user.service';

const AdminPagePerm: React.FC = () => {
    const [permanences, setPermanences] = useState<Permanence[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [editPermanence, setEditPermanence] = useState<Permanence | null>(null);

    const editorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        void fetchPermanences();
        void fetchUsers();
    }, []);

    const fetchPermanences = async () => {
        const res = await getAllPermanences();
        setPermanences(res.data as Permanence[]);
    };

    const fetchUsers = async () => {
        const res = await getUsersAdmin();
        setUsers(res as User[]);
    };

    return (
        <AdminLayout allowedRoles={['Admin', 'Respo CE']}>
            <div className="flex flex-col gap-10 px-4 py-6 max-w-7xl mx-auto">
                {/* Formulaire (créer/éditer) */}
                <RevealSection>
                    <PermanenceForm
                        editMode={editMode}
                        editPermanence={editPermanence}
                        onRefresh={fetchPermanences}
                        onCancelEdit={() => {
                            setEditMode(false);
                            setEditPermanence(null);
                        }}
                    />
                </RevealSection>

                {/* Liste des permanences */}
                <RevealSection delay={0.1}>
                    <PermanenceList
                        permanences={permanences}
                        users={users}
                        onRefresh={fetchPermanences}
                        onEdit={(perm: Permanence) => {
                            setEditMode(true);
                            setEditPermanence(perm);
                            setTimeout(() => {
                                editorRef.current?.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                        }}
                    />
                </RevealSection>

                {/* Actions globales */}
                <RevealSection delay={0.2}>
                    <PermanenceActions permanences={permanences} onRefresh={fetchPermanences} />
                </RevealSection>

                {/* Import CSV (si dispo) */}
                <RevealSection delay={0.3}>
                    <ImportPermCSV />
                </RevealSection>
            </div>
        </AdminLayout>
    );
};

export default AdminPagePerm;
