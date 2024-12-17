import z from 'zod';

export interface GetEventsInputDTO {
    token: string;
}

export const getEventsSchema = z
    .object({
        token: z.string().min(1, { message: 'Token inválido' }),
    })
    .transform((data) => data as GetEventsInputDTO);
