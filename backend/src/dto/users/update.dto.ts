import { z } from 'zod';

export interface UpdateUserDTO {
    name: string;
    email: string;
    newEmail: string;
}

export const updateUserSchema = z.object({
    name: z
        .string()
        .min(6, { message: 'O nome deve conter no mínimo 2 caracteres' }),
    email: z.string().email({ message: 'Email inválido' }),
    newEmail: z.string().email({ message: 'Email inválido' }),
});
