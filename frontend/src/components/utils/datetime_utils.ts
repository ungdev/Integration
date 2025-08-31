// Pour préremplir un <input type="datetime-local">
// On reçoit une date en UTC (string ISO venant de la DB)
// On la convertit en locale (Europe/Paris) et on renvoie une string sans timezone
export const formatDateForInput = (date?: string | null) => {
  if (!date) return "";
  const localDate = new Date(date);
  if (isNaN(localDate.getTime())) return "";
  // Convertir en "YYYY-MM-DDTHH:mm"
  return localDate.toISOString().slice(0, 16);
};

// Pour envoyer vers la DB
// On reçoit une string "YYYY-MM-DDTHH:mm" venant de l'input datetime-local
// On la convertit en UTC ISO (toujours ce que ta DB attend)
export const formatDateForDB = (inputValue?: string | null) => {
  if (!inputValue) return null;
  const localDate = new Date(inputValue); // interprété en local
  if (isNaN(localDate.getTime())) return null;
  return localDate.toISOString(); // UTC
};

// Pour affichage lisible en français (Europe/Paris)
export const formatDateForDisplay = (date?: string | null) => {
  if (!date) return "";
  const localDate = new Date(date);
  if (isNaN(localDate.getTime())) return "";
  return localDate.toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
