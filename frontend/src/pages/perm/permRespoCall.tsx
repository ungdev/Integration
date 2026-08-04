import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { Footer } from '../../components/footer';
import EmergencyModal from '../../components/home/emergencyModal';
import { Navbar } from '../../components/navbar';
import { RespoPresenceManagement } from '../../components/permanence/appealPerm';
import { type DecodedToken } from '../../interfaces/token.interfaces';
import { decodeToken, getToken } from '../../services/requests/auth.service';
import { isUserRespo } from '../../services/requests/permanence.service';

const PermanencesPageRespoCall = () => {
    const [isRespo, setIsRespo] = useState<boolean | null>(null);

    useEffect(() => {
        const checkRespoStatus = async () => {
            try {
                const token = getToken();

                if (!token) {
                    return <Navigate to="/" />;
                }

                let decoded: DecodedToken;
                try {
                    decoded = decodeToken(token);
                } catch {
                    return <Navigate to="/" />;
                }

                const result = await isUserRespo(Number(decoded.userId));
                setIsRespo(result.data === true);
            } catch (error) {
                console.error('Erreur lors de la vérification du rôle respo', error);
                setIsRespo(false);
            }
        };

        checkRespoStatus();
    }, []);

    return (
        <div>
            <Navbar />
            <EmergencyModal />
            <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {isRespo === null ? (
                        <p className="text-center text-gray-500">Chargement...</p>
                    ) : isRespo === false ? (
                        <div className="text-center text-red-600 font-semibold text-lg">
                            ❌ Accès refusé : vous n'êtes pas responsable d'une permanence.
                        </div>
                    ) : (
                        <RespoPresenceManagement />
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PermanencesPageRespoCall;
