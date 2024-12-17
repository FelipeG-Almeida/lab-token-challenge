import { EventDatabase } from '../database/EventDatabase';
import { UserDatabase } from '../database/UserDatabase';
import { CreateEventInputDTO } from '../dto/events/createEvent.dto';
import { DeleteEventInputDTO } from '../dto/events/deleteEvent.dto';
import { EditEventInputDTO } from '../dto/events/editEvent.dto';
import { GetEventsInputDTO } from '../dto/events/listEvents.dto';
import { UpdateGuestStatusDTO } from '../dto/events/updateGuestStatus.dto';
import { BadRequestError } from '../errors/BadRequestError';
import { NotFoundError } from '../errors/NotFoundError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { Event, EventModel } from '../models/event';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';

export class EventBusiness {
    constructor(
        private tokenManager: TokenManager,
        private eventDatabase: EventDatabase,
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator
    ) {}

    public listEvents = async (
        input: GetEventsInputDTO
    ): Promise<EventModel[]> => {
        const payload = this.tokenManager.getPayload(input.token);

        if (payload === null) throw new BadRequestError('Token inválido');
        const events = await this.eventDatabase.listEventsByUser(payload.id);
        return events;
    };

    public createEvent = async (input: CreateEventInputDTO): Promise<void> => {
        const { token, description, startTime, endTime, invitedUsers } = input;

        if (new Date(startTime) > new Date(endTime)) {
            throw new BadRequestError(
                'A data final deve ser posterior a data inicial'
            );
        }

        const payload = this.tokenManager.getPayload(token);
        const id = this.idGenerator.generate();
        if (payload === null) {
            throw new BadRequestError('Token inválido');
        }

        const hasConflict = await this.eventDatabase.checkTimeConflict(
            payload.id,
            startTime,
            endTime
        );
        if (hasConflict) {
            throw new BadRequestError(
                'O evento não pode ser criado porque conflita com outro evento existente'
            );
        }

        const newEvent = new Event(
            id,
            description,
            startTime,
            endTime,
            payload.id,
            invitedUsers
        );

        const newEventDB = newEvent.toDBModel();
        await this.eventDatabase.insertEvent(newEventDB);

        if (invitedUsers && invitedUsers.length > 0) {
            invitedUsers.map(async (invited) => {
                const guest = await this.userDatabase.findUserByEmail(invited);
                if (guest?.id) {
                    await this.eventDatabase.insertGuest(id, guest?.id);
                }
            });
        }
    };

    public editEvent = async (input: EditEventInputDTO): Promise<void> => {
        const { id, token, description, startTime, endTime, invitedUsers } =
            input;

        if (new Date(startTime) > new Date(endTime)) {
            throw new BadRequestError(
                'A data final deve ser posterior a data inicial'
            );
        }

        const payload = this.tokenManager.getPayload(token);
        if (payload === null) {
            throw new BadRequestError('Token inválido');
        }

        const event = await this.eventDatabase.getEventById(id);
        if (!event) {
            throw new NotFoundError('Evento não encontrado');
        }

        if (payload.id !== event.creator_id) {
            throw new UnauthorizedError(
                'Você não tem permissão para editar este evento'
            );
        }

        const hasConflict = await this.eventDatabase.checkTimeConflict(
            payload.id,
            startTime,
            endTime,
            id
        );
        if (hasConflict) {
            throw new BadRequestError(
                'O evento não pode ser criado porque conflita com outro evento existente'
            );
        }

        const newEvent = new Event(
            id,
            description,
            startTime,
            endTime,
            event.creator_id,
            invitedUsers
        );
        await this.eventDatabase.editEvent(newEvent.toDBModel());

        if (invitedUsers && invitedUsers.length > 0) {
            invitedUsers.map(async (invited) => {
                const guest = await this.userDatabase.findUserByEmail(invited);
                if (guest?.id) {
                    await this.eventDatabase.updateGuest(id, guest?.id);
                }
            });
        }
    };

    public deleteEvent = async (input: DeleteEventInputDTO): Promise<void> => {
        const { id, token } = input;

        const payload = this.tokenManager.getPayload(token);
        if (payload === null) {
            throw new BadRequestError('Token invalido');
        }

        const event = await this.eventDatabase.getEventById(id);
        if (!event) {
            throw new NotFoundError('Evento não encontrado');
        }

        if (payload.id !== event.creator_id) {
            throw new UnauthorizedError(
                'Você não tem permissão para deletar esse evento'
            );
        }

        await this.eventDatabase.deleteEvent(id);
    };

    public updateGuestStatus = async (
        input: UpdateGuestStatusDTO
    ): Promise<void> => {
        const { eventId, token, newStatus } = input;

        const payload = this.tokenManager.getPayload(token);
        if (payload === null) {
            throw new BadRequestError('Token invalido');
        }

        if (newStatus !== 'CONFIRMED' && newStatus !== 'CANCELED') {
            throw new BadRequestError('Status inválido');
        }
        const guest = await this.eventDatabase.findGuestByEventIdAndUserId(
            eventId,
            payload.id
        );
        if (!guest) {
            throw new NotFoundError(
                'Convidado não encontrado para este evento'
            );
        }

        await this.eventDatabase.updateGuestStatus(
            eventId,
            payload.id,
            newStatus
        );
    };
}
