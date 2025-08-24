// Pour l'input datetime-local
export const formatDateForInput = (date?: string | null) => {
  if (!date) return "";
  const localDate = new Date(date);
  if (isNaN(localDate.getTime())) return ""; // date invalide
  const offsetDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
};

// Pour affichage lisible en français
export const formatDateForDisplay = (date?: string | null) => {
  if (!date) return "";
  const localDate = new Date(date);
  if (isNaN(localDate.getTime())) return "";
  return localDate.toLocaleString("fr-FR", {
    timeZone: "Europe/Paris", // évite les surprises
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
