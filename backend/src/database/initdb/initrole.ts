import { db } from "../db";  // Assurez-vous que votre instance db est correcte
import { roleSchema } from "../../schemas/Basic/role.schema";

// Liste des rôles à ajouter
// Liste des rôles avec leurs descriptions
const roles = [
    { name: "Animation", description: "Animer, divertir et motiver les CE et les nouveaux étudiants tout au long de la pré-inté et de l’inté." },
    { name: "Bouffe", description: "Prévoir, organiser et coordonner tous les repas de l’inté. La bouffe c’est sacré !" },
    { name: "Cahier de vacances", description: "Élaborer le futur cahier de vacances des nouveaux avec des petits exercices et blagues." },
    { name: "Communication & Graphisme", description: "Préparer et gérer toute la communication de l’intégration, créer une charte graphique." },
    { name: "Déco", description: "Être créatif et fabriquer de quoi décorer l’UTT au thème de l’inté." },
    { name: "Défis TC", description: "Préparer un défi où les nouveaux TC doivent faire preuve d’ingéniosité pour fabriquer quelque chose." },
    { name: "Dev / Info", description: "Maintenir le site et l’application de l’inté et développer de nouveaux outils informatiques." },
    { name: "Faux amphi", description: "Créer un faux premier cours compliqué pour les TC avec des professeurs et des faux élèves." },
    { name: "Faux discours de rentrée", description: "Préparer et faire un discours de rentrée pour faire une petite frayeur aux nouveaux." },
    { name: "Logistique", description: "Préparer, organiser et mettre en place tout le matériel nécessaire pour l’intégration." },
    { name: "Médiatik", description: "Couvrir les événements de l’intégration, prendre des photos et monter des films souvenirs." },
    { name: "Parrainage", description: "Attribuer des parrains/marraines aux nouveaux étudiants de manière personnalisée." },
    { name: "Partenariat", description: "Rechercher et établir des partenariats utiles pour l'intégration et les nouveaux étudiants." },
    { name: "Prévention", description: "Évaluer les risques et mettre en place des mesures préventives avant et pendant l’intégration." },
    { name: "Rallye", description: "Organiser une après-midi de jeux et d’activités sportives pour les nouveaux étudiants." },
    { name: "Respo CE", description: "Gérer le planning des CE et les guider pour qu’ils accueillent au mieux les nouveaux." },
    { name: "Sécu", description: "Gérer la sécurité des événements, notamment durant le WEI et la soirée d’intégration." },
    { name: "Soirée d'intégration", description: "Organiser une soirée sur le campus UTT durant la semaine d’inté." },
    { name: "Son et lumière", description: "Installer et gérer le son et la lumière durant les événements nécessitant une ambiance spéciale." },
    { name: "Soutenabilité", description: "Mettre en place des actions pour réduire l’impact environnemental de l’intégration." },
    { name: "Traduction en anglais", description: "Traduire les contenus de l’intégration pour les étudiants étrangers." },
    { name: "Village Asso", description: "Organiser un événement pour présenter les associations UTTiennes aux nouveaux étudiants." },
    { name: "Visites", description: "Organiser les visites de l’UTT et de la ville pour les nouveaux étudiants." },
    { name: "WEI", description: "Organiser le Week-end d’intégration (transport, animation, logistique, soirée, etc.)." }
  ];
  
export const initRoles = async () => {
    for (const role of roles) {
      await db.insert(roleSchema).values(role).onConflictDoNothing(); // Évite les doublons
    }
  };
