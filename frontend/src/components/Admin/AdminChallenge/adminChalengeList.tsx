import { CheckCircle2, Edit, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import Select, { SingleValue } from "react-select";
import Swal from "sweetalert2";
import { Challenge } from "../../../interfaces/challenge.interface";
import { Faction } from "../../../interfaces/faction.interface";
import { Team } from "../../../interfaces/team.interface";
import { User } from "../../../interfaces/user.interface";
import { deleteChallenge, validateChallenge } from "../../../services/requests/challenge.service";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";

interface Props {
    challenges: Challenge[];
    refreshChallenges: () => void;
    onEdit: (c: Challenge) => void;
    teams: Team[];
    factions: Faction[];
    users: User[];
}

type ValidationTarget = "user" | "team" | "faction";

const AdminChallengeList = ({ challenges, refreshChallenges, onEdit, teams, factions, users }: Props) => {
    const [showValidationFormForId, setShowValidationFormForId] = useState<number | null>(null);
    const [validationType, setValidationType] = useState<ValidationTarget | null>(null);
    const [selectedTargetId, setSelectedTargetId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");


    const filteredChallenges = useMemo(() => {
        return challenges.filter(
            (c) =>
                c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [challenges, searchTerm]);

    const handleDelete = async (id: number) => {
        const confirm = await Swal.fire({
            title: "Supprimer ce challenge ?",
            text: "Cette action est irréversible 🚨",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e3342f",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Oui, supprimer",
            cancelButtonText: "Annuler",
        });

        if (!confirm.isConfirmed) return;

        try {
            await deleteChallenge(id);
            Swal.fire("Supprimé ✅", "Le challenge a bien été supprimé.", "success");
            refreshChallenges();
        } catch (err) {
            Swal.fire("Erreur ❌", "Impossible de supprimer le challenge.", "error");
        }
    };

    const handleValidate = async () => {
        if (!showValidationFormForId || !validationType || !selectedTargetId) return;

        try {
            const res = await validateChallenge({
                challengeId: showValidationFormForId,
                type: validationType,
                targetId: selectedTargetId,
            });

            Swal.fire({
                icon: "success",
                title: "Challenge validé ✅",
                text: res.message,
                timer: 2000,
                showConfirmButton: false,
            });

            setShowValidationFormForId(null);
            setValidationType(null);
            setSelectedTargetId(null);
            refreshChallenges();
        } catch (err) {
            console.error("Erreur lors de la validation du challenge", err);
            Swal.fire({
                icon: "error",
                title: "Erreur ❌",
                text: "Impossible de valider ce challenge. Réessaie plus tard.",
            });
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    📜 Challenges
                </CardTitle>
            </CardHeader>
            <CardContent>

                {/* 🔎 Barre de recherche */}
                <div className="flex items-center gap-3 mb-6">
                    <Search className="w-5 h-5 text-gray-500" />
                    <Input
                        type="text"
                        placeholder="Rechercher un challenge..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1"
                    />
                </div>

                {/* Liste filtrée */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredChallenges.length > 0 ? (
                        filteredChallenges.map((c) => (
                            <Card
                                key={c.id}
                                className="bg-gray-100 border shadow flex flex-col justify-between"
                            >
                                <CardContent className="p-4">
                                    <div>
                                        <h4 className="font-bold text-lg">{c.title}</h4>
                                        <p className="text-gray-700">{c.description}</p>
                                        <p className="text-sm text-gray-500 mt-1">Catégorie : {c.category}</p>
                                        <p className="text-sm text-gray-500">Points : {c.points}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <Button
                                            onClick={() => onEdit(c)}
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2"
                                        >
                                            <Edit className="w-4 h-4" /> Modifier
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(c.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" /> Supprimer
                                        </Button>
                                        <Button
                                            onClick={() => setShowValidationFormForId(c.id)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> Valider
                                        </Button>
                                    </div>

                                    {showValidationFormForId === c.id && (
                                        <Card className="mt-6 bg-white border shadow-inner">
                                            <CardContent className="p-4 space-y-4">
                                                <h4 className="font-bold text-lg">✅ Valider le challenge</h4>

                                                <Select
                                                    placeholder="Choisir le type de cible"
                                                    onChange={(option: SingleValue<{ value: ValidationTarget; label: string }>) => {
                                                        setValidationType(option?.value ?? null);
                                                        setSelectedTargetId(null);
                                                    }}
                                                    options={[
                                                        { value: "user", label: "Utilisateur" },
                                                        { value: "team", label: "Équipe" },
                                                        { value: "faction", label: "Faction" },
                                                    ]}
                                                />

                                                {validationType === "user" && (
                                                    <Select
                                                        placeholder="Sélectionner un utilisateur"
                                                        onChange={(option) => setSelectedTargetId(Number(option?.value))}
                                                        options={users.map((u: User) => ({
                                                            value: u.userId,
                                                            label: `${u.firstName} ${u.lastName}`,
                                                        }))}
                                                    />
                                                )}

                                                {validationType === "team" && (
                                                    <Select
                                                        placeholder="Sélectionner une équipe"
                                                        onChange={(option) => setSelectedTargetId(Number(option?.value))}
                                                        options={teams.map((t: Team) => ({
                                                            value: t.teamId,
                                                            label: t.name,
                                                        }))}
                                                    />
                                                )}

                                                {validationType === "faction" && (
                                                    <Select
                                                        placeholder="Sélectionner une faction"
                                                        onChange={(option) => setSelectedTargetId(Number(option?.value))}
                                                        options={factions.map((f: Faction) => ({
                                                            value: f.factionId,
                                                            label: f.name,
                                                        }))}
                                                    />
                                                )}

                                                <div className="flex gap-4">
                                                    <Button
                                                        onClick={handleValidate}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                                    >
                                                        ✅ Valider
                                                    </Button>
                                                    <Button
                                                        onClick={() => {
                                                            setShowValidationFormForId(null);
                                                            setValidationType(null);
                                                            setSelectedTargetId(null);
                                                        }}
                                                        className="bg-gray-400 hover:bg-gray-500 text-white"
                                                    >
                                                        ❌ Annuler
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full">Aucun challenge trouvé.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default AdminChallengeList;
