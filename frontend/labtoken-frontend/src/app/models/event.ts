export interface Event {
    id: string;
    description: string;
    startTime: string;
    endTime: string;
    creatorId: string;
    creatorName: string;
    isAllDay: boolean;
    invitedUsers: Guest[];
}

export interface Guest {
    user_id: string;
    status: 'CONFIRMED' | 'PENDING' | 'CANCELED';
    invited_at: string;
}

export interface CreateEvent {
    description: string;
    startTime: string;
    endTime: string;
    invitedUsers: string[];
}
