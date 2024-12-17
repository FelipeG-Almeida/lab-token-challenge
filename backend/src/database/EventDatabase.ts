import { EventDB, EventModel } from '../models/event';
import { Guest } from '../models/guest';
import { DBManager } from './DBManager';

export class EventDatabase extends DBManager {
    public static TABLE_EVENTS = 'events';
    public static TABLE_GUESTS = 'guests';

    public async listEventsByUser(userId: string): Promise<EventModel[]> {
        const result = await DBManager.connection(EventDatabase.TABLE_EVENTS)
            .leftJoin(
                EventDatabase.TABLE_GUESTS,
                `${EventDatabase.TABLE_EVENTS}.id`,
                `${EventDatabase.TABLE_GUESTS}.event_id`
            )
            .select(
                `${EventDatabase.TABLE_EVENTS}.id`,
                `${EventDatabase.TABLE_EVENTS}.description`,
                `${EventDatabase.TABLE_EVENTS}.start_time`,
                `${EventDatabase.TABLE_EVENTS}.end_time`,
                `${EventDatabase.TABLE_EVENTS}.creator_id`,
                `${EventDatabase.TABLE_EVENTS}.is_all_day`,
                DBManager.connection.raw(
                    `GROUP_CONCAT(
                    JSON_OBJECT(
                        'user_id', ${EventDatabase.TABLE_GUESTS}.user_id,
                        'status', ${EventDatabase.TABLE_GUESTS}.status,
                        'invited_at', ${EventDatabase.TABLE_GUESTS}.invited_at
                    )
                ) as invitedUsers`
                )
            )
            .where(function () {
                this.where(
                    `${EventDatabase.TABLE_EVENTS}.creator_id`,
                    userId
                ).orWhere(`${EventDatabase.TABLE_GUESTS}.user_id`, userId);
            })
            .groupBy(`${EventDatabase.TABLE_EVENTS}.id`);

        return result.map((row) => ({
            id: row.id,
            description: row.description,
            startTime: row.start_time,
            endTime: row.end_time,
            creatorId: row.creator_id,
            isAllDay: row.is_all_day === 1,
            invitedUsers: row.invitedUsers ? row.invitedUsers.split(',') : [],
        }));
    }

    public async insertEvent(newEvent: EventDB): Promise<void> {
        await DBManager.connection(EventDatabase.TABLE_EVENTS).insert(newEvent);
    }

    public async checkTimeConflict(
        creatorId: string,
        startTime: string,
        endTime: string,
        eventId?: string
    ): Promise<boolean> {
        const query = DBManager.connection(EventDatabase.TABLE_EVENTS)
            .select('id')
            .where('creator_id', '=', creatorId)
            .andWhere((builder) => {
                builder
                    .whereBetween('start_time', [startTime, endTime])
                    .orWhereBetween('end_time', [startTime, endTime])
                    .orWhere((builder2) => {
                        builder2
                            .where('start_time', '<=', startTime)
                            .andWhere('end_time', '>=', endTime);
                    });
            });
        if (eventId) {
            query.andWhere('id', '<>', eventId);
        }
        const result = await query;

        return result.length > 0;
    }

    public async getEventById(id: string): Promise<EventDB> {
        const [event] = await DBManager.connection(
            EventDatabase.TABLE_EVENTS
        ).where({ id });
        return event;
    }

    public async editEvent(event: EventDB): Promise<void> {
        await DBManager.connection(EventDatabase.TABLE_EVENTS)
            .where({ id: event.id })
            .update({
                description: event.description,
                start_time: event.start_time,
                end_time: event.end_time,
                invited_users: JSON.stringify(event.invited_users),
            });
    }

    public async deleteEvent(id: string): Promise<void> {
        await DBManager.connection(EventDatabase.TABLE_EVENTS)
            .del()
            .where({ id });
    }

    public async insertGuest(eventId: string, guestId: string): Promise<void> {
        const guest: Guest = {
            event_id: eventId,
            user_id: guestId,
            status: 'PENDING',
            invited_at: new Date().toDateString(),
        };

        await DBManager.connection(EventDatabase.TABLE_GUESTS).insert(guest);
    }

    public async updateGuest(eventId: string, userId: string): Promise<void> {
        await DBManager.connection(EventDatabase.TABLE_GUESTS)
            .where({ event_id: eventId })
            .delete();

        await this.insertGuest(eventId, userId);
    }

    public async findGuestByEventIdAndUserId(
        eventId: string,
        userId: string
    ): Promise<Guest> {
        const guest = await DBManager.connection(EventDatabase.TABLE_GUESTS)
            .where({ event_id: eventId, user_id: userId })
            .first();
        return guest;
    }

    public async updateGuestStatus(
        eventId: string,
        userId: string,
        newStatus: string
    ): Promise<void> {
        await DBManager.connection(EventDatabase.TABLE_GUESTS)
            .where({ event_id: eventId, user_id: userId })
            .update({ status: newStatus });
    }
}
