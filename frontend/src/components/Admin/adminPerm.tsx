import { Button } from "src/styles/components/ui/button";
import { Input } from "src/styles/components/ui/input";
import { Textarea } from "src/styles/components/ui/textarea";
import { Card } from "src/styles/components/ui/card";
import Select from "react-select";
import { useState, useEffect } from "react";
import { 
    createPermanence, 
    getAllPermanences, 
    openPermanence, 
    closePermanence, 
    updatePermanence, 
    getUsersByPermanence, 
    addUserToPermanence, 
    removeUserFromPermanence, 
    deletePermanence } from "../../services/requests/permanence.service"; // ton service
import { formatDateForDisplay, formatDateForInput } from "../utils/datetime_utils";
import { User } from "src/interfaces/user.interface";
import { getUsers } from "src/services/requests/user.service";

export const AdminPermanence: React.FC = () => {

    const [newPermanenceName, setNewPermanenceName] = useState("");
    const [newPermanenceDescription, setNewPermanenceDescription] = useState("");
    const [newPermanenceLocation, setNewPermanenceLocation] = useState("");
    const [newPermanenceStartDate, setNewPermanenceStartDate] = useState("");
    const [newPermanenceEndDate, setNewPermanenceEndDate] = useState("");
    const [newPermanenceCapacity, setNewPermanenceCapacity] = useState(0);
    const [permanences, setPermanences] = useState<any[]>([]); // Liste des permanences existantes
    const [editMode, setEditMode] = useState(false);
    const [editPermanence, setEditPermanence] = useState<any | null>(null); // Permanence à éditer
    const [showMembers, setShowMembers] = useState<number | null>(null);
    const [members, setMembers] = useState<User[]>([]);
    const [newMember, setNewMember] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);


  useEffect(() => {
    // Charger la liste des permanences au démarrage
    fetchPermanences();
    fetchUsers();
  }, []);

  const fetchPermanences = async () => {
    try {
      const response = await getAllPermanences(); // ton service
      setPermanences(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des permanences", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers(); // ton service
      setUsers(response);
    } catch (error) {
      console.error("Erreur lors du chargement des permanences", error);
    }
  };


  const fetchMembers = async (permId: number) => {
    try {
      const res = await getUsersByPermanence(permId);
      setMembers(res.data);
      setShowMembers(permId);
    } catch (err) {
      console.error("Erreur lors de la récupération des membres", err);
    }
  };

  const handleCreatePermanence = async () => {
    if (
      !newPermanenceName ||
      !newPermanenceDescription ||
      !newPermanenceLocation ||
      !newPermanenceStartDate ||
      !newPermanenceEndDate ||
      !newPermanenceCapacity
    ) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      const response = await createPermanence({
        name: newPermanenceName,
        description: newPermanenceDescription,
        location: newPermanenceLocation,
        start_at: newPermanenceStartDate,
        end_at: newPermanenceEndDate,
        capacity: newPermanenceCapacity,
      });
      alert(response.message);
      // Réinitialiser les champs du formulaire
      setNewPermanenceName("");
      setNewPermanenceDescription("");
      setNewPermanenceLocation("");
      setNewPermanenceStartDate("");
      setNewPermanenceEndDate("");
      setNewPermanenceCapacity(0);
      fetchPermanences(); // Recharger les permanences après création
    } catch (err) {
      console.error("Erreur lors de la création de la permanence", err);
    }
  };

  const handleOpenAllPermanences = async () => {
    try {
      // Ouvrir toutes les permanences à J+7
      await Promise.all(
        permanences.filter((perm) => {
          const startDate = new Date(perm.start_at);
          const today = new Date();
          today.setDate(today.getDate() + 7);
            return today > startDate
        }).map((perm) => openPermanence(perm.id))
      );
      alert("Toutes les permanences ont été ouvertes !");
      fetchPermanences(); // Recharger les permanences après ouverture
    } catch (err) {
      console.error("Erreur lors de l'ouverture des permanences", err);
    }
  };

  const handleCloseAllPermanences = async () => {
    try {
      // Ouvrir toutes les permanences à J+7
      await Promise.all(
        permanences.filter((perm) => {
          const startDate = new Date(perm.start_at);
          const today = new Date();
          today.setDate(today.getDate() + 7);
            return today > startDate
        }).map((perm) => closePermanence(perm.id))
      );
      alert("Toutes les permanences ont été fermées !");
      fetchPermanences(); // Recharger les permanences après ouverture
    } catch (err) {
      console.error("Erreur lors de l'ouverture des permanences", err);
    }
  };

  const handleOpenPermanence = async (permId: number) => {
    try {
      const response = await openPermanence(permId);
      alert(response.message);
      fetchPermanences(); // Recharger les permanences après ouverture
    } catch (err) {
      console.error("Erreur lors de l'ouverture de la permanence", err);
    }
  };

  const handleClosePermanence = async (permId: number) => {
    try {
      const response = await closePermanence(permId);
      alert(response.message);
      fetchPermanences(); // Recharger les permanences après fermeture
    } catch (err) {
      console.error("Erreur lors de la fermeture de la permanence", err);
    }
  };

  const handleEditPermanence = (perm: any) => {
    setEditMode(true);
    setEditPermanence(perm);
    setNewPermanenceName(perm.name);
    setNewPermanenceDescription(perm.description);
    setNewPermanenceLocation(perm.location);
    setNewPermanenceStartDate(formatDateForInput(perm.start_at));  // Formatage de la date pour l'input
    setNewPermanenceEndDate(formatDateForInput(perm.end_at));      // Formatage de la date pour l'input
    setNewPermanenceCapacity(perm.capacity);
  };

  const handleSaveEditPermanence = async () => {
    if (
      !newPermanenceName ||
      !newPermanenceDescription ||
      !newPermanenceLocation ||
      !newPermanenceStartDate ||
      !newPermanenceEndDate ||
      !newPermanenceCapacity
    ) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      const response = await updatePermanence( editPermanence.id, {
        name: newPermanenceName,
        description: newPermanenceDescription,
        location: newPermanenceLocation,
        start_at: newPermanenceStartDate,
        end_at: newPermanenceEndDate,
        capacity: newPermanenceCapacity,
      });
      alert(response.message);
      setEditMode(false);

      setNewPermanenceName("");
      setNewPermanenceDescription("");
      setNewPermanenceLocation("");
      setNewPermanenceStartDate("");
      setNewPermanenceEndDate("");
      setNewPermanenceCapacity(0);

      fetchPermanences(); // Recharger les permanences après modification
    } catch (err) {
      console.error("Erreur lors de l'édition de la permanence", err);
    }
  };

  const handleAddMember = async (permId: number, user: User) => {
    try {
      const response = await addUserToPermanence(permId, user.userId);
      alert(response.message);
      setNewMember(null);
      fetchMembers(permId);
      fetchPermanences();
    } catch (err) {
      console.error("Erreur lors de l'ajout du membre", err);
    }
  };
  
  const handleRemoveMember = async (permId: number, userId: number) => {
    try {
      const response = await removeUserFromPermanence(permId, userId);
      alert(response.message);
      fetchMembers(permId);
      fetchPermanences();
    } catch (err) {
      console.error("Erreur lors de la suppression du membre", err);
    }
  };

  const handleDeletePermanence = async (permId: number) => {
    try {
      const response = await deletePermanence(permId);
      alert(response.message);
      fetchPermanences();
    } catch (err) {
      console.error("Erreur lors de la suppression du membre", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 px-4 py-8 mx-auto max-w-6xl">
      {/* Formulaire */}
      <Card className="w-full max-w-2xl p-6 shadow-lg rounded-2xl">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          {editMode ? "✏️ Éditer la permanence" : "➕ Créer une permanence"}
        </h2>
  
        <div className="flex flex-col gap-4">
          <Input placeholder="Nom de la permanence" value={newPermanenceName} onChange={(e) => setNewPermanenceName(e.target.value)} />
          <Textarea placeholder="Description" value={newPermanenceDescription} onChange={(e) => setNewPermanenceDescription(e.target.value)} />
          <Input placeholder="Emplacement" value={newPermanenceLocation} onChange={(e) => setNewPermanenceLocation(e.target.value)} />
          <Input type="datetime-local" value={newPermanenceStartDate} onChange={(e) => setNewPermanenceStartDate(e.target.value)} />
          <Input type="datetime-local" value={newPermanenceEndDate} onChange={(e) => setNewPermanenceEndDate(e.target.value)} />
          <Input placeholder="Capacité" value={newPermanenceCapacity} onChange={(e) => setNewPermanenceCapacity(Number(e.target.value))} />
  
          <Button
            onClick={editMode ? handleSaveEditPermanence : handleCreatePermanence}
            className="bg-green-600 hover:bg-green-700 text-white mt-4 transition"
          >
            {editMode ? "✅ Sauvegarder" : "Créer"}
          </Button>
        </div>
      </Card>
  
      {/* Boutons d’action groupés */}
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <Button onClick={handleOpenAllPermanences} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl">
          📅 Ouvrir toutes à J+7
        </Button>
        <Button onClick={handleCloseAllPermanences} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl">
          🛑 Fermer toutes à J+7
        </Button>
      </div>
  
      {/* Liste des permanences */}
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📋 Permanences existantes</h2>
        <div className="flex flex-col gap-6">
          {permanences.map((perm) => (
            <Card key={perm.id} className="p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-gray-900">{perm.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{perm.description}</p>
              <div className="text-gray-700 text-sm mt-4 space-y-1">
                <div><strong>📍 Emplacement :</strong> {perm.location}</div>
                <div><strong>🕒 Début :</strong> {formatDateForDisplay(perm.start_at)}</div>
                <div><strong>🕔 Fin :</strong> {formatDateForDisplay(perm.end_at)}</div>
                <div><strong>👥 Capacité restante :</strong> {perm.capacity}</div>
              </div>
  
              <div className="flex flex-wrap gap-2 mt-4">
                {perm.is_open ? (
                  <Button onClick={() => handleClosePermanence(perm.id)} className="bg-orange-600 hover:bg-orange-700 text-white">
                    Fermer
                  </Button>
                ) : (
                  <Button onClick={() => handleOpenPermanence(perm.id)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Ouvrir
                  </Button>
                )}
                <Button onClick={() => handleEditPermanence(perm)} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                  Éditer
                </Button>
                <Button onClick={() => fetchMembers(perm.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  👥 Voir membres
                </Button>
                <Button onClick={() => handleDeletePermanence(perm.id)} className="bg-red-600 hover:bg-red-700 text-white">
                  🗑️ Supprimer
                </Button>
              </div>
  
              {/* Liste des membres */}
              {showMembers === perm.id && (
                <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <h4 className="text-md font-semibold mb-2">Membres inscrits</h4>

  
                  {members.length === 0 ? (
                    <p className="text-sm text-gray-500">Aucun membre pour l’instant.</p>
                  ) : (
                    <ul className="text-sm space-y-1">
                      {members.map((user) => (
                        <li key={user.userId} className="flex justify-between items-center">
                          <span>{user.firstName + " " + user.lastName}</span>
                          <Button
                            onClick={() => handleRemoveMember(perm.id, user.userId)}
                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1"
                          >
                            Retirer
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
  
                    <div className="flex flex-col md:flex-row gap-2 mt-4 items-center">
                    <div className="flex-1">
                        <Select
                        options={users
                            .filter((user) => !members.some((m) => m.userId === user.userId))
                            .map((user) => ({
                            value: user,
                            label: user.firstName || user.lastName
                                ? `${user.firstName || ""} ${user.lastName || ""}`
                                : `Utilisateur ${user.userId}`,
                            }))}
                        onChange={(option) => setNewMember(option?.value || null)}
                        placeholder="Sélectionner un utilisateur à ajouter"
                        isClearable
                        />
                    </div>

                    <Button
                        onClick={() => newMember && handleAddMember(perm.id, newMember)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        Ajouter
                    </Button>
                    </div>
                  <p className="text-s text-red-500 underline mt-4" ><strong>Attention en tant qu'Admin vous pouvez bypass les quotas</strong></p>
                  <Button
                    onClick={() => setShowMembers(null)}
                    className="text-xs text-gray-500 underline mt-4"
                  >
                    Fermer la liste des membres
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
)};

