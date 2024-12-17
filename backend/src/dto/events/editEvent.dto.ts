import { z } from 'zod';

export interface EditEventInputDTO {
    id: string;
    token: string;
    description: string;
    startTime: string;
    endTime: string;
    invitedUsers?: string[];
}

export const editEventSchema = z.object({
    id: z.string().min(1, { message: 'Id inválido' }),
    token: z.string().min(1, { message: 'Token inválido' }),
    description: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    invitedUsers: z.array(z.string().email()).optional().default([]),
});
