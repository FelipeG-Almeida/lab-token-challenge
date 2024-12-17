import { z } from 'zod';

export interface UpdateUserDTO {
    token: string;
    name: string;
    email: string;
}

export const updateUserSchema = z.object({
    token: z.string().min(1, { message: 'Token inválido' }),
    name: z
        .string()
        .min(6, { message: 'O nome deve conter no mínimo 2 caracteres' }),
    email: z.string().email({ message: 'Email inválido' }),
});
