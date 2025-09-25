import { z } from "zod";
// import { ErreurMessages } from "../utils/errorsMessage.js";

// Fonction de validation pour les dates (format texte ou ISO)
const validateDateString = (dateStr: string) => {
  if (!dateStr || dateStr.trim() === '') return false;

  try {
    // Essayer de parser comme date (ISO ou autre format valide)
    const date = new Date(dateStr.trim());
    return !isNaN(date.getTime()) && date.getTime() > 0;
  } catch {
    return false;
  }
};

export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Le titre est obligatoire"),
  description: z.string().optional(),
  completed: z.boolean().optional(),
  startDate: z.string().refine(validateDateString, {
    message: "Format invalide. Utilisez: YYYY-MM-DD HH:MM ou YYYY-MM-DD"
  }),
  endDate: z.string().optional().refine((val) => {
    if (!val || val.trim() === '') return true; // Optionnel
    return validateDateString(val);
  }, {
    message: "Format invalide. Utilisez: YYYY-MM-DD HH:MM ou YYYY-MM-DD"
  }),
  reminderEnabled: z.boolean().optional(),
  reminderSound: z.string().optional(),
}).refine((data) => {
  // Si endDate est fourni, vérifier qu'elle est après startDate
  if (data.endDate && data.endDate.trim() !== '') {
    try {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return false;
      }

      if (endDate <= startDate) {
        return false;
      }
    } catch {
      return false;
    }
  }
  return true;
}, {
  message: "La date de fin doit être après la date de début",
  path: ["endDate"],
});
