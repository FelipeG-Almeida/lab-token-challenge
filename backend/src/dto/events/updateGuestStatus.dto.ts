import { z } from 'zod';

export interface UpdateGuestStatusDTO {
    token: string;
    eventId: string;
    newStatus: 'CONFIRMED' | 'CANCELED';
}

export const updateGuestStatusSchema = z.object({
    token: z.string().min(1, { message: 'Token inválido' }),
    eventId: z.string().min(1, { message: 'Id do evento inválido' }),
    newStatus: z.enum(['CONFIRMED', 'CANCELED'], {
        message: 'Status inválido',
    }),
});
