import { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";

import {
    createPermanence,
    updatePermanence,
} from "../../../services/requests/permanence.service";

import { getUsers } from "../../../services/requests/user.service";

import { Permanence } from "../../../interfaces/permanence.interface";
import { User } from "../../../interfaces/user.interface";
import { formatDateForDB, formatDateForInput } from "../../utils/datetime_utils";

interface PermanenceFormProps {
    editMode: boolean;
    editPermanence: Permanence | null;
    onRefresh: () => void;
    onCancelEdit: () => void;
}

const PermanenceForm = ({
    editMode,
    editPermanence,
    onRefresh,
    onCancelEdit,
}: PermanenceFormProps) => {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [location, setLocation] = useState("");
    const [startAt, setStartAt] = useState(Date);
    const [endAt, setEndAt] = useState(Date);
    const [capacity, setCapacity] = useState(0);
    const [difficulty, setDifficulty] = useState(0);
    const [respo, setRespo] = useState<User | null>();
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch {
                Swal.fire("Erreur", "Impossible de charger les utilisateurs", "error");
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        if (editMode && editPermanence) {
            setName(editPermanence.name);
            setDesc(editPermanence.description);
            setLocation(editPermanence.location);
            setStartAt(formatDateForInput(editPermanence.start_at));
            setEndAt(formatDateForInput(editPermanence.end_at));
            setCapacity(editPermanence.capacity);
            setDifficulty(editPermanence.difficulty);
            if (editPermanence.respo) {
                setRespo(editPermanence.respo);
            }
        }
    }, [editMode, editPermanence]);

    const handleSubmit = async () => {
        if (!editMode) {
            if (!name || !desc || !location || !startAt || !endAt) {
                Swal.fire("Erreur", "Veuillez remplir tous les champs", "warning");
                return;
            }

            if (capacity < 0 || difficulty < 0) {
                Swal.fire("Erreur", "Capacité et difficulté doivent être positives", "warning");
                return;
            }
        }


        let respoId = respo && !isNaN(Number(respo.userId)) ? Number(respo.userId) : null;


        try {
            const payload = {
                name,
                description: desc,
                location,
                start_at: formatDateForDB(startAt), // ✅ en UTC
                end_at: formatDateForDB(endAt),     // ✅ en UTC
                capacity,
                difficulty,
                respoId,
            };

            if (editMode && editPermanence) {
                await updatePermanence(editPermanence.id, payload);
                Swal.fire("Succès", "Permanence mise à jour", "success");
                onCancelEdit();
            } else {
                await createPermanence(payload);
                Swal.fire("Succès", "Permanence créée", "success");
            }

            resetForm();
            onRefresh();
        } catch (err: any) {
            Swal.fire("Erreur", err.response.data.message, "error");
        }
    };

    const resetForm = () => {
        setName("");
        setDesc("");
        setLocation("");
        setStartAt("");
        setEndAt("");
        setCapacity(0);
        setDifficulty(0);
        setRespo(null);
    };

    const respoOptions = users.map((user) => ({
        value: user.userId,
        label: `${user.firstName} ${user.lastName}`,
    }));

    const selectedRespoOption = respo
        ? { value: respo.userId, label: `${respo.firstName} ${respo.lastName}` }
        : null;

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center">
                    {editMode ? "✏️ Modifier une permanence" : "➕ Créer une permanence"}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Input
                    placeholder="Nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Textarea
                    placeholder="Description"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                />
                <Input
                    placeholder="Lieu"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <div className="flex flex-col gap-1">
                    <label>Début :</label>
                    <Input
                        type="datetime-local"
                        value={startAt}
                        onChange={(e) => setStartAt(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label>Fin :</label>
                    <Input
                        type="datetime-local"
                        value={endAt}
                        onChange={(e) => setEndAt(e.target.value)}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label>Capacité :</label>
                    <Input
                        type="number"
                        placeholder="Capacité"
                        value={capacity}
                        onChange={(e) => setCapacity(Number(e.target.value))}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label>Difficulté :</label>
                    <Input
                        type="number"
                        placeholder="Difficulté"
                        value={difficulty}
                        onChange={(e) => setDifficulty(Number(e.target.value))}
                    />
                </div>

                <Select
                    value={selectedRespoOption}
                    onChange={(selectedOption) => {
                        const selectedUser = users.find(
                            (u) => u.userId === selectedOption?.value
                        );
                        setRespo(selectedUser || null);
                    }}
                    options={respoOptions}
                    placeholder="Sélectionner un responsable"
                    className="basic-select"
                    classNamePrefix="select"
                />

                <div className="flex gap-2">
                    <Button
                        onClick={handleSubmit}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {editMode ? "✅ Sauvegarder" : "Créer"}
                    </Button>
                    {editMode && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                resetForm();
                                onCancelEdit();
                            }}
                        >
                            Annuler
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default PermanenceForm;
