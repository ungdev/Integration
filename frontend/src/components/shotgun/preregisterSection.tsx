import { useState, useEffect } from "react";
import { createTeam } from "../../services/requests/team.service";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { checkPreRegisterStatus } from "../../services/requests/event.service";
import { getUsers } from "../../services/requests/user.service";
import Select from "react-select"; // Importer react-select

export const TeamRegistration = () => {
  const [teamName, setTeamName] = useState(""); // Nom de l'équipe
  const [members, setMembers] = useState<string[]>([]); // Membres sélectionnés en tant que chaîne de caractères (ID)
  const [isPreRegistrationOpen, setIsPreRegistrationOpen] = useState(false); // Statut de la pré-inscription
  const [users, setUsers] = useState<{ userId: number, firstName: string, lastName: string }[]>([]); // Liste des utilisateurs

  // Récupérer le statut de la pré-inscription
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await checkPreRegisterStatus();
        setIsPreRegistrationOpen(status); // Mettre à jour l'état en fonction du statut
      } catch (error) {
        alert("Erreur lors de la récupération du statut de pré-inscription.");
      }
    };
    fetchStatus();
  }, []);

  // Récupérer la liste des utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await getUsers(); // Récupère les utilisateurs
        setUsers(userList); // Met à jour la liste des utilisateurs
      } catch (error) {
        alert("Erreur lors de la récupération des utilisateurs.");
      }
    };
    fetchUsers();
  }, []);

  // Gérer l'enregistrement de l'équipe
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convertir les membres en un tableau de nombres avant de les envoyer
    const memberIds = members.map((id) => parseInt(id)); // Convertir chaque ID en nombre

    try {
      const response = await createTeam(teamName, memberIds); // Appeler l'API pour créer l'équipe
      alert(response.message);
    } catch (error : any) {
      alert(error.response.data.message);
    }
  };

  // Préparer les options de `react-select` (utilisateurs)
  const userOptions = users.map(user => ({
    value: user.userId.toString(), // ID de l'utilisateur comme valeur (en string)
    label: `${user.firstName} ${user.lastName}`, // Affichage du nom complet
  }));

  // Gérer la sélection des membres dans react-select
  const handleSelectChange = (selectedOptions: any) => {
    setMembers(selectedOptions ? selectedOptions.map((option: any) => option.value) : []);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Pré-inscription de l'équipe</h2>

      {/* Afficher le formulaire uniquement si la pré-inscription est ouverte */}
      {isPreRegistrationOpen ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Champ pour le nom de l'équipe */}
          <Input
            type="text"
            placeholder="Nom de l'équipe"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-300"
          />

          {/* Sélection des membres avec react-select */}
          <div className="space-y-2">
            <label htmlFor="members" className="block text-lg text-gray-700">Sélectionner les membres de l'équipe :</label>
            <Select
              id="members"
              isMulti
              options={userOptions} // Les options que nous avons préparées
              value={userOptions.filter(option => members.includes(option.value))} // Valeur des membres sélectionnés
              onChange={handleSelectChange} // Fonction de gestion du changement
              placeholder="Rechercher et sélectionner les membres"
              className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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

          {/* Bouton pour enregistrer l'équipe */}
          <Button type="submit" className="w-full py-3 text-lg bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300">
            Enregistrer l'équipe
          </Button>
        </form>
      ) : (
        <p className="text-center text-red-500 text-lg">La pré-inscription est actuellement fermée.</p>
      )}
    </div>
  );
};
