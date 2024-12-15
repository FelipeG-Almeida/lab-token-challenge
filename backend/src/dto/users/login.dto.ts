import { z } from 'zod';

export interface LoginInputDTO {
    email: string;
    password: string;
}

export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'A senha deve conter no mínimo 8 caracteres'),
});
