import { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import { Tent } from "../../interfaces/tent.interface";
import { User } from "../../interfaces/user.interface";
import { decodeToken, getToken } from "../../services/requests/auth.service";
import { checkWEIStatus } from "../../services/requests/event.service";
import { cancelTent, createTent, getUserTent } from "../../services/requests/tent.service";
import { getUsers } from "../../services/requests/user.service";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const TentPublic = () => {
    const [userId2, setUserId2] = useState<number | null>(null);
    const [tentInfo, setTentInfo] = useState<Tent | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [isWEIOpen, setIsWEIOpen] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const result = await getUsers();
                setUsers(result);
            } catch {
                Swal.fire("Erreur", "Impossible de charger les utilisateurs", "error");
            }
        };

        const fetchTent = async () => {
            try {
                const result = await getUserTent();
                if (result?.data && result.data.length > 0) {
                    setTentInfo(result.data[0]);
                }
            } catch {
                Swal.fire("Erreur", "Impossible de récupérer la tente", "error");
            }
        };

        const fetchWEIStatus = async () => {
            try {
                const status = await checkWEIStatus();
                setIsWEIOpen(status);
            } catch {
                Swal.fire("Erreur", "Impossible de récupérer le statut du WEI", "error");
            }
        };

        fetchUsers();
        fetchTent();
        fetchWEIStatus();
    }, []);

    const token = getToken();
    if (!token) return null;
    const { userId } = decodeToken(token);

    const handleCreate = async () => {
        if (!userId2) {
            return Swal.fire("Erreur", "Sélectionne ton binôme", "error");
        }

        try {
            Swal.fire({
                title: "Création...",
                text: "Ta tente est en cours de création",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            await createTent(userId2);

            Swal.fire("✅ Succès", "Ta tente a été créée avec succès !", "success");
            handleGetTent();
        } catch (err: any) {
            Swal.fire("Erreur", err.message || "Impossible de créer la tente", "error");
        }
    };

    const handleCancel = async () => {
        const confirm = await Swal.fire({
            title: "Annuler la tente ?",
            text: "Tu ne pourras pas revenir en arrière.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Oui, annuler",
            cancelButtonText: "Non, garder",
        });

        if (!confirm.isConfirmed) return;

        try {
            await cancelTent();
            setTentInfo(null);
            setUserId2(null);
            Swal.fire("🛑 Annulée", "Ta tente a bien été annulée", "success");
        } catch {
            Swal.fire("Erreur", "Impossible d'annuler la tente", "error");
        }
    };

    const handleGetTent = async () => {
        try {
            const result = await getUserTent();
            if (result?.data && result.data.length > 0) {
                setTentInfo(result.data[0]);
            }
        } catch {
            Swal.fire("Erreur", "Impossible de récupérer la tente", "error");
        }
    };

    return (
        <>
            <Card className="w-full max-w-6xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                        🏕️ Réserve ta tente
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-10">
                    {isWEIOpen ? (
                        !tentInfo ? (
                            <>
                                <div className="mb-6">
                                    <label className="block mb-2 text-gray-700 font-medium">Choisis ton binôme :</label>
                                    <Select
                                        placeholder="Sélectionne ton binôme"
                                        options={users
                                            .filter((user: User) => user.userId !== userId)
                                            .map((user: User) => ({
                                                value: user.userId,
                                                label: `${user.firstName} ${user.lastName}`,
                                            }))}
                                        value={
                                            userId2
                                                ? {
                                                    value: userId2,
                                                    label: `${users.find((u) => u.userId === userId2)?.firstName || ""} ${users.find((u) => u.userId === userId2)?.lastName || ""
                                                        }`,
                                                }
                                                : null
                                        }
                                        onChange={(option) => setUserId2(option?.value || null)}
                                        isClearable
                                        className="shadow-sm"
                                    />
                                </div>

                                <div className="flex justify-center">
                                    <Button
                                        onClick={handleCreate}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow"
                                        disabled={!userId2}
                                    >
                                        ✅ Créer
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="mt-6 surface-card p-5">
                                <h3 className="font-semibold text-lg mb-3">🎫 Ta tente</h3>
                                <p className="text-gray-700">
                                    Binôme avec {" "}
                                    <span className="font-bold text-green-700">
                                        {
                                            users.find(
                                                (user) =>
                                                    user.userId ===
                                                    (tentInfo.user_id_1 === userId ? tentInfo.user_id_2 : tentInfo.user_id_1)
                                            )?.firstName
                                        } {" "}
                                        {
                                            users.find(
                                                (user) =>
                                                    user.userId ===
                                                    (tentInfo.user_id_1 === userId ? tentInfo.user_id_2 : tentInfo.user_id_1)
                                            )?.lastName
                                        }
                                    </span>
                                </p>

                                <div className="mt-4">
                                    {tentInfo.confirmed ? (
                                        <p className="text-green-700 font-semibold">✅ Ta tente est confirmée !</p>
                                    ) : (
                                        <p className="text-yellow-600 font-medium">
                                            ⏳ En attente de confirmation - tu recevras un mail bientôt.
                                        </p>
                                    )}
                                </div>

                                <div className="flex space-x-4 mt-6">
                                    <Button
                                        onClick={handleCancel}
                                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow"
                                    >
                                        ❌ Annuler
                                    </Button>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="text-center">
                            <p className="text-xl text-red-600 font-semibold mb-2">🚫 Réservations fermées</p>
                            <p className="text-gray-600">
                                La réservation de tentes pour le WEI n'est pas encore disponible.
                                <br />
                                🔔 Reste connecté, elle ouvrira bientôt !
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card >
        </>
    );
};
