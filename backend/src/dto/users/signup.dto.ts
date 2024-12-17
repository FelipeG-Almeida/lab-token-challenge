import { z } from 'zod';

export interface SignupInputDTO {
    name: string;
    email: string;
    password: string;
}

export const signupSchema = z
    .object({
        name: z
            .string()
            .min(6, { message: 'O nome deve conter no mínimo 6 caracteres' }),
        email: z.string().email({ message: 'Email inválido' }),
        password: z
            .string()
            .min(8, { message: 'A senha deve conter no mínimo 8 caracteres' }),
    })
    .transform((data) => data as SignupInputDTO);
