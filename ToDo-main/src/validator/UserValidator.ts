import { z } from "zod";
// import { Role } from "@prisma/client";

// ✅ Schéma de validation User
export const UserSchema = z.object({
  name: z.string().min(2, "Le nom doit avoir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit avoir au moins 6 caractères"),
//   role: z.nativeEnum(Role, {
//     errorMap: () => ({
//       message: "Rôle invalide. Valeurs possibles: ADMIN, USER, MANAGER",
//     }),
//   }),
});

// ✅ Pour la création (tout obligatoire)
export type CreateUserDTO = z.infer<typeof UserSchema>;

// ✅ Pour la mise à jour (tout optionnel sauf role enum)
export const UpdateUserSchema = UserSchema.partial();
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
