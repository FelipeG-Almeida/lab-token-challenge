import { z } from 'zod';

export interface DeleteEventInputDTO {
    id: string;
    token: string;
}

export const deleteEventSchema = z.object({
    id: z.string().min(1, { message: 'Id inválido' }),
    token: z.string().min(1, { message: 'Token inválido' }),
});
