import { z } from 'zod';

export interface CreateEventInputDTO {
    token: string;
    description: string;
    startTime: string;
    endTime: string;
    invitedUsers?: string[];
}

export const createEventSchema = z.object({
    token: z.string().min(1, { message: 'Token inválido' }),
    description: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    invitedUsers: z.array(z.string().email()).optional().default([]),
});
