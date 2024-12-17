export interface Guest {
    event_id: string;
    user_id: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
    invited_at: string;
}
