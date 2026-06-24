import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import  Select  from "react-select";
import Swal from "sweetalert2";

import { type ValidatedChallenge } from "../../../interfaces/challenge.interface";
import { unvalidateChallenge } from "../../../services/requests/challenge.service";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";



interface Props {
    validatedChallenges: ValidatedChallenge[];
    fetchValidatedChallenges: () => void | Promise<void>;
}

export const AdminValidatedChallengesList = ({
    validatedChallenges,
    fetchValidatedChallenges,
}: Props) => {
    const [search, setSearch] = useState("");
    const [showUnvalidationFormForId, setShowUnvalidationFormForId] = useState<number | null>(null);
    const [selectedUnvalidationTargetIds, setSelectedUnvalidationTargetIds] = useState<number[]>([]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return validatedChallenges.filter((c) =>
            [
                c.challenge_name,
                c.challenge_categorie,
                c.challenge_description,
                c.target_user_firstname ?? "",
                c.target_user_lastname ?? "",
                c.target_team_name ?? "",
                c.target_faction_name ?? "",
            ]
                .join(" ")
                .toLowerCase()
                .includes(q)
        );
    }, [validatedChallenges, search]);

    const groupedValidatedChallenges = useMemo(() => {
        const groups = new Map<
            number,
            {
                challenge_id: number;
                challenge_name: string;
                challenge_categorie: string;
                challenge_description: string;
                points: number;
                validated_at: string;
                recipients: Array<{ id: number; label: string }>;
            }
        >();

        filtered.forEach((c) => {
            const category = c.challenge_categorie?.toLowerCase();
            const recipientId =
                category === "user"
                    ? c.target_user_id
                    : category === "team"
                    ? c.target_team_id
                    : category === "faction"
                    ? c.target_faction_id
                    : null;
            const recipientLabel =
                category === "user"
                    ? `${c.target_user_firstname ?? ""} ${c.target_user_lastname ?? ""}`.trim()
                    : category === "team"
                    ? c.target_team_name
                    : category === "faction"
                    ? c.target_faction_name
                    : null;

            if (!groups.has(c.challenge_id)) {
                groups.set(c.challenge_id, {
                    challenge_id: c.challenge_id,
                    challenge_name: c.challenge_name,
                    challenge_categorie: c.challenge_categorie,
                    challenge_description: c.challenge_description,
                    points: c.points,
                    validated_at: c.validated_at,
                    recipients: [],
                });
            }

            const group = groups.get(c.challenge_id);
            if (group && recipientId != null && recipientLabel) {
                const alreadyAdded = group.recipients.some((r) => r.id === recipientId);
                if (!alreadyAdded) {
                    group.recipients.push({ id: recipientId, label: recipientLabel });
                }
            }
        });

        return Array.from(groups.values());
    }, [filtered]);

    const handleUnvalidate = async (
    ) => {
        const confirm = await Swal.fire({
            title: "Confirmer la dévalidation ?",
            text: "Cette action retirera la validation du challenge.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e3342f",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Oui, dévalider",
            cancelButtonText: "Annuler",
        });
        if (!confirm.isConfirmed) return;
        for (const targetId of selectedUnvalidationTargetIds) {
            console.log("Dévalidation du challenge pour l'ID cible :", targetId);
            console.log(validatedChallenges);
            const challengeToUnvalidate = validatedChallenges.find(
                (c) => c.challenge_id === showUnvalidationFormForId
            );
            console.log("Challenge à dévalider :", challengeToUnvalidate);
            if (!challengeToUnvalidate) {
                Swal.fire({ icon: "error", title: "Erreur", text: "Challenge non trouvé." });
                return;
            }
            try {
                const res = await unvalidateChallenge({
                    challengeId: showUnvalidationFormForId as number,
                    factionId: challengeToUnvalidate.target_faction_id ?? 0,
                    teamId: challengeToUnvalidate.target_team_id ?? 0,
                    userId: challengeToUnvalidate.target_user_id ?? 0,
                });
                console.log("Réponse de la dévalidation :", res);
                validatedChallenges = validatedChallenges.filter(
                    (c) =>
                        c.challenge_id === showUnvalidationFormForId &&
                        c.target_user_id !== targetId &&
                        c.target_team_id !== targetId &&
                        c.target_faction_id !== targetId
                );
            } catch {
                Swal.fire({ icon: "error", title: "Erreur", text: "Impossible de dévalider ce challenge." });
            }
        }

        Swal.fire({
            icon: "success",
            title: "Dévalidé",
            text: "Les challenges ont été dévalidés.",
            timer: 1800,
            showConfirmButton: false,
        });
        await fetchValidatedChallenges();
        setSelectedUnvalidationTargetIds([]);
        setShowUnvalidationFormForId(null);
    }

    const handleUnvalidateAll = async () => {
        const confirm = await Swal.fire({
            title: "Confirmer la dévalidation ?",
            text: "Cette action retirera la validation du challenge.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e3342f",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Oui, dévalider",
            cancelButtonText: "Annuler",
        });

        if (!confirm.isConfirmed) return;

        const challengesToUnvalidate = validatedChallenges.filter(
            (c) => c.challenge_id === showUnvalidationFormForId
        );

        for (const challenge of challengesToUnvalidate) {
            try {
                await unvalidateChallenge({
                    challengeId: showUnvalidationFormForId as number,
                    factionId: challenge.target_faction_id ?? 0,
                    teamId: challenge.target_team_id ?? 0,
                    userId: challenge.target_user_id ?? 0,
                });
            } catch {
                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text: "Impossible de dévalider un ou plusieurs challenges.",
                });
                return;
            }
        }

        Swal.fire({
            icon: "success",
            title: "Dévalidé",
            text: "Les challenges ont été dévalidés.",
            timer: 1800,
            showConfirmButton: false,
        });

        await fetchValidatedChallenges();
        setSelectedUnvalidationTargetIds([]);
        setShowUnvalidationFormForId(null);
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                        📋 Challenges validés
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Recherche */}
                    <div className="flex items-center gap-2 border rounded-lg p-2 shadow-sm bg-gray-50">
                        <Search className="w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Rechercher (challenge, utilisateur, équipe, faction, catégorie)"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border-none focus:ring-0 bg-transparent flex-1"
                        />
                    </div>

                    {/* Grille */}
                    {filtered.length === 0 ? (
                        <p className="text-center text-gray-500">Aucun challenge validé trouvé.</p>
                    ) : (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {groupedValidatedChallenges.map((group) => (
                                <div
                                    key={group.challenge_id}
                                    className="flex flex-col justify-between space-y-4 p-4 border rounded-xl bg-gray-50 hover:shadow-md transition"
                                >
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900">{group.challenge_name}</h3>
                                        <p className="text-gray-600">{group.challenge_categorie}</p>
                                        <p className="text-gray-500 text-sm">{group.challenge_description}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-gray-700"><strong>Points :</strong> {group.points}</p>
                                        <p className="text-gray-500 text-sm">
                                            <strong>Validé le :</strong> {new Date(group.validated_at).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-gray-800 font-semibold">Destinataires :</p>
                                        {group.recipients.length > 0 ? (
                                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                                {group.recipients.map((recipient) => (
                                                    <li key={recipient.id}>{recipient.label}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-700">Aucun destinataire connu.</p>
                                        )}
                                    </div>

                                    <Button
                                        onClick={() => setShowUnvalidationFormForId(group.challenge_id)}
                                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded w-full"
                                    >
                                        Invalidation
                                    </Button>
                                    {showUnvalidationFormForId === group.challenge_id && (
                                        <Card className="mt-6 bg-white border shadow-inner">
                                            <CardContent className="p-4 space-y-4">

                                                <h4 className="font-bold text-lg">❌ Invalider le challenge</h4>

                                                <Select
                                                    isMulti
                                                    placeholder="Sélectionner les validations à retirer"
                                                    onChange={(options) =>
                                                        setSelectedUnvalidationTargetIds(options.map((o) => Number(o.value)))
                                                    }
                                                    options={group.recipients.map((recipient) => ({
                                                        value: recipient.id,
                                                        label: recipient.label,
                                                    }))}
                                                />

                                                <div className="flex gap-4">
                                                    <Button
                                                        onClick={() => handleUnvalidate()}
                                                        className="bg-red-600 hover:bg-red-700 text-white"
                                                    >
                                                        ❌ Invalider
                                                    </Button>

                                                    <Button
                                                        onClick={() => handleUnvalidateAll()}
                                                        className="bg-orange-600 hover:bg-orange-700 text-white"
                                                    >
                                                        🚨 Invalider tous
                                                    </Button>

                                                    <Button
                                                        onClick={() => setShowUnvalidationFormForId(null)}
                                                        className="bg-gray-400 hover:bg-gray-500 text-white"
                                                    >
                                                        Annuler
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
