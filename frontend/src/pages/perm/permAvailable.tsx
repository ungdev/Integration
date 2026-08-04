import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import EmergencyModal from '../../components/home/emergencyModal';
import { Navbar } from '../../components/navbar';
import { AvailablePermanencesList } from '../../components/permanence/permList';
import { type Permanence } from '../../interfaces/permanence.interface';
import { applyToPermanence, getMyPermanences, getOpenPermanences } from '../../services/requests/permanence.service';

const PermanencesPageAvailable: React.FC = () => {
    const [permanences, setPermanences] = useState<Permanence[]>([]);
    const [myPermanences, setMyPermanences] = useState<Permanence[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [openPerms, myPerms] = await Promise.all([getOpenPermanences(), getMyPermanences()]);
            setPermanences(openPerms);
            setMyPermanences(myPerms);
        } catch (err) {
            console.error('Erreur lors du chargement des permanences', err);
            Swal.fire('Erreur', 'Impossible de charger les permanences.', 'error');
        }
    };

    const handleApplyToPermanence = async (permId: number) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const response = await applyToPermanence(permId);
            await Swal.fire('Succès ✅', response.message, 'success');
            fetchData();
        } catch (err) {
            console.error("Erreur lors de l'inscription", err);
            Swal.fire('Erreur', "Impossible de s'inscrire à la permanence.", 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Navbar />
            <EmergencyModal />
            <div className="min-h-screen flex justify-center bg-gray-50 py-10 px-4">
                <div className="w-full max-w-6xl flex flex-col gap-12">
                    <AvailablePermanencesList
                        permanences={permanences}
                        myPermanences={myPermanences}
                        isSubmitting={isSubmitting}
                        onApply={handleApplyToPermanence}
                    />
                </div>
            </div>
        </div>
    );
};

export default PermanencesPageAvailable;
