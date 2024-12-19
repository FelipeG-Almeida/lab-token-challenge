export interface EventModel {
    id: string;
    description: string;
    startTime: string;
    endTime: string;
    creatorId: string;
    creatorName: string;
    isAllDay: boolean;
    invitedUsers: string[];
}

export interface EventDB {
    id: string;
    description: string;
    start_time: string;
    end_time: string;
    creator_id: string;
    is_all_day: number;
    invited_users: string[];
}

export class Event {
    constructor(
        private id: string,
        private description: string,
        private startTime: string,
        private endTime: string,
        private creatorId: string,
        private invitedUsers: string[] = []
    ) {}

    public getId(): string {
        return this.id;
    }

    public getDescription(): string {
        return this.description;
    }

    public getStartTime(): string {
        return this.startTime;
    }

    public getEndTime(): string {
        return this.endTime;
    }

    public getCreatorId(): string {
        return this.creatorId;
    }

    public getInvitedUsers(): string[] {
        return this.invitedUsers;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public setStartTime(startTime: string): void {
        this.startTime = startTime;
    }

    public setEndTime(endTime: string): void {
        this.endTime = endTime;
    }

    public setCreatorId(creatorId: string): void {
        this.creatorId = creatorId;
    }

    public setInvitedUsers(invitedUsers: string[]): void {
        this.invitedUsers = invitedUsers;
    }

    public getIsAllDay(): boolean {
        const startDate = new Date(this.startTime);
        const endDate = new Date(this.endTime);

        return endDate.getTime() - startDate.getTime() === 86_400_000;
    }

    public toDBModel(): EventDB {
        return {
            id: this.id,
            description: this.description,
            start_time: this.startTime,
            end_time: this.endTime,
            creator_id: this.creatorId,
            is_all_day: this.getIsAllDay() ? 1 : 0,
            invited_users: this.invitedUsers,
        };
    }
}
