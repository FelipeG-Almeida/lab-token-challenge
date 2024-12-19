import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateEvent, Event } from '../models/event';

const url = 'http://localhost:3000/events';

@Injectable({
    providedIn: 'root',
})
export class EventsGateway {
    constructor(private http: HttpClient) {}

    listEvents(): Observable<Event[]> {
        return this.http.get<Event[]>(`${url}/list`);
    }

    createEvent(event: CreateEvent): Observable<void> {
        return this.http.post<void>(`${url}/create`, event);
    }

    updateEvent(id: string, event: CreateEvent): Observable<void> {
        return this.http.put<void>(`${url}/edit/${id}`, event);
    }

    deleteEvent(id: string): Observable<void> {
        return this.http.delete<void>(`${url}/delete/${id}`);
    }

    changeStatus(eventId: string, newStatus: string): Observable<void> {
        return this.http.put<void>(`${url}/guest`, { eventId, newStatus });
    }
}
