import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

import { Footer } from "../components/footer";
import { Navbar } from "../components/navbar";
import { RespoPresenceManagement } from "../components/permanence/appealPerm";
import { AvailablePermanencesList } from "../components/permanence/permList";
import { MyPermanencesList } from "../components/permanence/permUser";
import { type Permanence } from "../interfaces/permanence.interface";
import { type DecodedToken } from "../interfaces/token.interfaces";
import { decodeToken, getToken } from "../services/requests/auth.service";
import {
    applyToPermanence,
    cancelPermanence,
    getMyPermanences,
    getOpenPermanences,
    isUserRespo,
} from "../services/requests/permanence.service";

export const AvailablePermanencesPage: React.FC = () => {
    const [permanences, setPermanences] = useState<Permanence[]>([]);
    const [myPermanences, setMyPermanences] = useState<Permanence[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [openPerms, myPerms] = await Promise.all([
                getOpenPermanences(),
                getMyPermanences(),
            ]);
            setPermanences(openPerms);
            setMyPermanences(myPerms);
        } catch (err) {
            console.error("Erreur lors du chargement des permanences", err);
            Swal.fire("Erreur", "Impossible de charger les permanences.", "error");
        }
    };

    const handleApplyToPermanence = async (permId: number) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const response = await applyToPermanence(permId);
            await Swal.fire("Succès ✅", response.message, "success");
            fetchData();
        } catch (err) {
            console.error("Erreur lors de l'inscription", err);
            Swal.fire("Erreur", "Impossible de s'inscrire à la permanence.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <Navbar />
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


export const MyPermanencesPage: React.FC = () => {
    const [myPermanences, setMyPermanences] = useState<Permanence[]>([]);

    useEffect(() => {
        fetchMyPermanences();
    }, []);

    const fetchMyPermanences = async () => {
        try {
            const perms = await getMyPermanences();
            setMyPermanences(perms);
        } catch (err) {
            console.error("Erreur lors du chargement", err);
            Swal.fire("Erreur", "Impossible de charger vos permanences.", "error");
        }
    };

    const handleCancelPermanence = async (permId: number) => {
        const selectedPermanence = myPermanences.find((perm) => perm.id === permId);
        if (!selectedPermanence) {
            Swal.fire("Erreur", "Permanence non trouvée.", "error");
            return;
        }

        const now = new Date();
        const deadline = new Date(selectedPermanence.start_at);
        deadline.setDate(deadline.getDate() - 1);

        if (now > deadline) {
            Swal.fire("Info", "La désinscription n'est plus possible.", "info");
            return;
        }

        const result = await Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Vous ne pourrez plus revenir en arrière.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui, me désinscrire",
            cancelButtonText: "Annuler",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        });

        if (!result.isConfirmed) return;

        try {
            const response = await cancelPermanence(permId);
            Swal.fire("Succès ✅", response.message, "success");
            fetchMyPermanences();
        } catch (err) {
            console.error("Erreur lors de l'annulation", err);
            Swal.fire("Erreur", "Impossible de vous désinscrire.", "error");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen flex justify-center bg-gray-50 py-10 px-4">
                <div className="w-full max-w-6xl flex flex-col gap-12">
                    <MyPermanencesList
                        myPermanences={myPermanences}
                        onCancel={handleCancelPermanence}
                    />
                </div>
            </div>
        </div>
    );
};


export const RespoCallPage = () => {
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
                console.error("Erreur lors de la vérification du rôle respo", error);
                setIsRespo(false);
            }
        };

        checkRespoStatus();
    }, []);

    return (
        <div>
            <Navbar />
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
