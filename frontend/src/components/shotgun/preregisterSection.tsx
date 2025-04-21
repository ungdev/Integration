import { useState, useEffect } from "react";
import { createTeam } from "../../services/requests/team.service";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { checkPreRegisterStatus } from "../../services/requests/event.service";
import { getUsers } from "../../services/requests/user.service";
import Select from "react-select";

export const TeamRegistration = () => {
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [isPreRegistrationOpen, setIsPreRegistrationOpen] = useState(false);
  const [users, setUsers] = useState<{ userId: number; firstName: string; lastName: string }[]>([]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await checkPreRegisterStatus();
        setIsPreRegistrationOpen(status);
      } catch (error) {
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
      } catch (error) {
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
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 rounded-xl shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-gray-800">
        Pré-inscription de l'équipe
      </h2>

      <p className="text-center text-sm sm:text-base text-gray-700 mb-6">
        📝 Donnez un nom <strong>inspiré d'une musique</strong> à votre équipe si possible !
        <br />
        (Ce nom est provisoire, c’est juste pour vous reconnaître lors du shotgun 🎯)
      </p>

      {isPreRegistrationOpen ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Nom de l'équipe (ex: Mary on a Cross)"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-300"
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

          <Button
            type="submit"
            className="w-full py-3 text-lg bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            Enregistrer l'équipe
          </Button>
        </form>
      ) : (
        <p className="text-center text-red-500 text-lg">
          La pré-inscription est actuellement fermée.
        </p>
      )}
    </div>
  );
};
