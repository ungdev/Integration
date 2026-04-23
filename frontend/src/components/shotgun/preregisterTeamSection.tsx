import { useEffect, useState } from "react";
import Select from "react-select";

import { checkPreRegisterStatus } from "../../services/requests/event.service";
import { createTeam } from "../../services/requests/team.service";
import { getUsers } from "../../services/requests/user.service";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

export const PreregisterTeamSection = () => {
    const [teamName, setTeamName] = useState("");
    const [members, setMembers] = useState<string[]>([]);
    const [isPreRegistrationOpen, setIsPreRegistrationOpen] = useState(false);
    const [users, setUsers] = useState<{ userId: number; firstName: string; lastName: string }[]>([]);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const status = await checkPreRegisterStatus();
                setIsPreRegistrationOpen(status);
            } catch {
                alert("Erreur lors de la récupération du statut de pré-inscription.");
            }
        };
        fetchStatus();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userList = await getUsers();
                setUsers(userList);
            } catch {
                alert("Erreur lors de la récupération des utilisateurs.");
            }
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const memberIds = members.map((id) => parseInt(id));

        try {
            const response = await createTeam(teamName, memberIds);
            alert(response.message);
        } catch (error: any) {
            alert(error.response.data.message);
        }
    };

    const userOptions = users.map((user) => ({
        value: user.userId.toString(),
        label: `${user.firstName} ${user.lastName}`,
    }));

    const handleSelectChange = (selectedOptions: any) => {
        setMembers(selectedOptions ? selectedOptions.map((option: any) => option.value) : []);
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                    Pré-inscription de l'équipe
                </CardTitle>
                <p className="text-lg md:text-xl text-gray-700 text-center">
                    Une réponse <u>par équipe</u>
                </p>
            </CardHeader>
            <CardContent className="space-y-10">
                {isPreRegistrationOpen ? (
                    <>
                        <h3 className="text-xl sm:text-l md:text-xl font-bold mb-4 text-center text-blue-700">Etape 1: le GForm de motivation !</h3>

                        <div className="relative pb-[56.25%] surface-card overflow-hidden mb-4">
                            <iframe
                                src="https://forms.gle/wUNQ1QyqevDBmK6i8"
                                className="absolute inset-0 w-full h-full border-none"
                                title="Formulaire de pré-inscription CE"
                                loading="lazy"
                            >
                                Chargement…
                            </iframe>
                        </div>

                        <h3 className="text-xl sm:text-l md:text-xl font-bold mt-10 mb-4 text-center text-blue-700">Etape 2: Sélection des membres</h3>

                        <Card className="bg-gradient-to-br from-blue-100 to-purple-200">
                            <CardContent className="space-y-10">
                                <p className="text-center text-sm sm:text-base text-gray-700 mb-6">
                                    📝 Donnez un nom <strong>inspiré d'une musique</strong> à votre équipe si possible !
                                    <br />
                                    (Ce nom est provisoire, c'est juste pour vous reconnaître lors du shotgun 🎯)
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <Input
                                            type="text"
                                            placeholder="Nom de l'équipe (ex: Mary on a Cross)"
                                            value={teamName}
                                            onChange={(e) => setTeamName(e.target.value)}
                                            className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition duration-300 bg-white"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="members" className="block text-lg text-gray-700">
                                            Sélectionner les membres de l'équipe :
                                        </label>
                                        <Select
                                            id="members"
                                            isMulti
                                            options={userOptions}
                                            value={userOptions.filter((option) => members.includes(option.value))}
                                            onChange={handleSelectChange}
                                            placeholder="Rechercher et sélectionner les membres"
                                            className="w-full"
                                            styles={{
                                                control: (provided: any) => ({
                                                    ...provided,
                                                    borderColor: '#E5E7EB',
                                                    borderRadius: '0.375rem',
                                                    padding: '0.5rem',
                                                    boxShadow: 'none',
                                                    '&:hover': { borderColor: '#60A5FA' },
                                                }),
                                                multiValue: (provided: any) => ({
                                                    ...provided,
                                                    backgroundColor: '#60A5FA',
                                                    color: 'white',
                                                }),
                                                multiValueLabel: (provided: any) => ({
                                                    ...provided,
                                                    color: 'white',
                                                }),
                                            }}
                                        />
                                    </div>

                                    <p className="text-center text-gray-600 mb-4">
                                        Si tu ne trouves pas un coéquipier, c'est qu'il ne s'est jamais connecté sur ce site !
                                        <br />
                                        Il lui suffit de se connecter une fois pour apparaitre dans cette liste.
                                    </p>

                                    <Button
                                        type="submit"
                                        className="w-full py-3 text-lg bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                    >
                                        Enregistrer l'équipe
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    <p className="text-center text-red-500 text-lg font-semibold">
                        🚫 La pré-inscription est actuellement fermée.
                    </p>
                )}
            </CardContent>
        </Card >
    );
};
