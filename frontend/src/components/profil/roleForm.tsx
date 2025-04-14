import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getUserPrefrences, updateUserPreferences } from "../../services/requests/role.service";

const commissions = [
  { id: 1, name: "Animation", description: "Animer et divertir les CE et nouveaux étudiants." },
  { id: 2, name: "Bouffe", description: "Organiser tous les repas de l’inté." },
  { id: 3, name: "Cahier de vacances", description: "Créer un cahier d'exercices et blagues." },
  { id: 4, name: "Communication & Graphisme", description: "Gérer la com et créer une charte graphique." },
  { id: 5, name: "Déco", description: "Décorer l’UTT selon le thème de l’inté." },
  { id: 6, name: "Défis TC", description: "Préparer un défi créatif pour les nouveaux TC." },
  { id: 7, name: "Dev / Info", description: "Développer et maintenir les outils numériques." },
  { id: 8, name: "Faux amphi", description: "Créer un faux cours pour piéger les nouveaux." },
  { id: 9, name: "Faux discours de rentrée", description: "Faire un faux discours pour surprendre les étudiants." },
  { id: 10, name: "Logistique", description: "Organiser et gérer le matériel de l’inté." },
  { id: 11, name: "Médiatik", description: "Capturer les événements avec photos et vidéos." },
  { id: 12, name: "Parrainage", description: "Attribuer des parrains/marraines aux nouveaux étudiants." },
  { id: 13, name: "Partenariat", description: "Trouver des partenaires pour l’intégration." },
  { id: 14, name: "Prévention", description: "Gérer les risques et assurer la sécurité." },
  { id: 15, name: "Rallye", description: "Organiser une après-midi de jeux et défis sportifs." },
  { id: 16, name: "Respo CE", description: "Gérer le planning des CE et organiser leurs activités." },
  { id: 17, name: "Sécu", description: "Assurer la sécurité durant les événements." },
  { id: 18, name: "Soirée d'intégration", description: "Organiser la grande soirée d’inté." },
  { id: 19, name: "Son et lumière", description: "Gérer le son et lumière des événements." },
  { id: 20, name: "Soutenabilité", description: "Réduire l’impact écologique de l’inté." },
  { id: 21, name: "Traduction en anglais", description: "Traduire les contenus pour les étudiants internationaux." },
  { id: 22, name: "Village Asso", description: "Organiser la présentation des associations." },
  { id: 23, name: "Visites", description: "Planifier les visites de l’UTT et de la ville." },
  { id: 24, name: "WEI", description: "Organiser le Week-End d’Intégration." }
];


export const UserPreferences = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const userPreferences = await getUserPrefrences();
        userPreferences.forEach((roleId: number) => setValue(roleId.toString(), true));  // Marque les cases comme cochées
      } catch (error) {
        console.error("Erreur lors du chargement des préférences", error);
      }
    };
    fetchPreferences();
  }, [setValue]);

  const onSubmit = async (data: Record<string, boolean>) => {
    
    setLoading(true);
    // Extraire les `roleId` des cases à cocher qui sont sélectionnées
    const selectedRoleIds = Object.keys(data).filter((key) => data[key]).map((key) => parseInt(key)); 


    try {
      await updateUserPreferences(selectedRoleIds); // Envoie des `roleId`
      alert("Préférences mises à jour !");
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-10 space-y-10 max-w-5xl mx-auto">
      <Card className="w-full p-6 rounded-2xl shadow space-y-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">Préférences de commission</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-3 gap-4">
              {commissions.map(({ id, name, description }) => (
                <div key={id} className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={name}
                      {...register(id.toString())} // Enregistrer l'ID comme nom dans le formulaire
                    />
                    <label htmlFor={name} className="text-sm font-medium">{name}</label>
                  </div>
                  <p className="text-xs text-gray-500">{description}</p>
                </div>
              ))}
            </div>

            <Button type="submit" className="mt-6 w-full" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};