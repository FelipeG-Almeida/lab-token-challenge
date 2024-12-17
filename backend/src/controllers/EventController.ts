import { Request, Response } from 'express';
import { EventBusiness } from '../business/EventBusiness';
import { ZodError } from 'zod';
import { BaseError } from '../errors/BaseError';
import { getEventsSchema } from '../dto/events/listEvents.dto';
import { createEventSchema } from '../dto/events/createEvent.dto';
import { editEventSchema } from '../dto/events/editEvent.dto';
import { deleteEventSchema } from '../dto/events/deleteEvent.dto';
import { updateGuestStatusSchema } from '../dto/events/updateGuestStatus.dto';

export class EventController {
    constructor(private eventBusiness: EventBusiness) {}

    public getEvents = async (req: Request, res: Response): Promise<void> => {
        try {
            const token = getEventsSchema.parse({
                token: req.headers.authorization,
            });
            const output = await this.eventBusiness.listEvents(token);

            res.status(200).send(output);
        } catch (error) {
            console.log(error);

            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };

    public createEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const input = createEventSchema.parse({
                token: req.headers.authorization,
                description: req.body.description,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                invitedUsers: req.body.invitedUsers,
            });
            await this.eventBusiness.createEvent(input);

            res.status(201).send();
        } catch (error) {
            console.log(error);

            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };

    public editEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const input = editEventSchema.parse({
                id: req.params.id,
                token: req.headers.authorization,
                description: req.body.description,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                invitedUsers: req.body.invitedUsers,
            });
            await this.eventBusiness.editEvent(input);

            res.status(200).send();
        } catch (error) {
            console.log(error);

            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };

    public deleteEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const input = deleteEventSchema.parse({
                id: req.params.id,
                token: req.headers.authorization,
            });
            await this.eventBusiness.deleteEvent(input);

            res.status(200).send();
        } catch (error) {
            console.log(error);

            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };

    public updateStatus = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const input = updateGuestStatusSchema.parse({
                token: req.headers.authorization,
                eventId: req.body.eventId,
                newStatus: req.body.newStatus,
            });
            await this.eventBusiness.updateGuestStatus(input);

            res.status(200).send();
        } catch (error) {
            console.log(error);

            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };
}
