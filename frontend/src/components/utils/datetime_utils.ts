// Fonction pour formater les dates pour l'input datetime-local
export const formatDateForInput = (date: string) => {
    const localDate = new Date(date);
    return localDate.toISOString().slice(0, 16); // Extrait la partie yyyy-MM-ddThh:mm
  };

// Fonction pour afficher les dates en format local dans la liste des permanences
export const formatDateForDisplay = (date: string) => {
    const localDate = new Date(date);
    return `${localDate.toISOString().slice(0, 10)}  Heure :  ${localDate.toISOString().slice(11, 16)}`;
};