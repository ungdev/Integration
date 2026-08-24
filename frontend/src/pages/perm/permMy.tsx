import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import EmergencyModal from '../../components/home/emergencyModal';
import { Navbar } from '../../components/navbar';
import { ConcurrentPermanencesCard } from '../../components/permanence/concurrentPerms';
import { MyPermanencesList } from '../../components/permanence/permUser';
import { usePermanences } from '../../contexts/permanences';
import { type Permanence } from '../../interfaces/permanence.interface';
import { cancelPermanence, getMyPermanences } from '../../services/requests/permanence.service';

const PermanencesPageMy: React.FC = () => {
    const [myPermanences, setMyPermanences] = useState<Permanence[]>([]);
    const { concurrentPermanences, concurrentPermanencesList, refreshPermanences } = usePermanences();

    useEffect(() => {
        fetchMyPermanences();
    }, []);

    const fetchMyPermanences = async () => {
        try {
            const perms = await getMyPermanences();
            setMyPermanences(perms);
        } catch (err) {
            console.error('Erreur lors du chargement', err);
            Swal.fire('Erreur', 'Impossible de charger vos permanences.', 'error');
        }
    };

    const handleCancelPermanence = async (permId: number) => {
        const selectedPermanence = myPermanences.find((perm) => perm.id === permId);
        if (!selectedPermanence) {
            Swal.fire('Erreur', 'Permanence non trouvée.', 'error');
            return;
        }

        const now = new Date();
        const deadline = new Date(selectedPermanence.start_at);
        deadline.setDate(deadline.getDate() - 1);

        if (now > deadline) {
            Swal.fire('Info', "La désinscription n'est plus possible.", 'info');
            return;
        }

        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: 'Vous ne pourrez plus revenir en arrière.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, me désinscrire',
            cancelButtonText: 'Annuler',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        });

        if (!result.isConfirmed) return;

        try {
            const response = await cancelPermanence(permId);
            Swal.fire('Succès ✅', response.message, 'success');
            fetchMyPermanences();
            await refreshPermanences();
        } catch (err) {
            console.error("Erreur lors de l'annulation", err);
            Swal.fire('Erreur', 'Impossible de vous désinscrire.', 'error');
        }
    };

    return (
        <div>
            <Navbar />
            <EmergencyModal />
            <div className="min-h-screen flex justify-center bg-gray-50 py-10 px-4">
                <div className="w-full max-w-6xl flex flex-col gap-12">
                    {concurrentPermanences && <ConcurrentPermanencesCard permanences={concurrentPermanencesList} />}
                    <MyPermanencesList myPermanences={myPermanences} onCancel={handleCancelPermanence} />
                </div>
            </div>
        </div>
    );
};

export default PermanencesPageMy;
