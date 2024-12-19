import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const url = 'http://localhost:3000/users';

@Injectable({
    providedIn: 'root',
})
export class AuthGateway {
    constructor(private http: HttpClient) {}

    login(email: string, password: string): Observable<string> {
        return this.http.post(
            `${url}/login`,
            { email, password },
            { responseType: 'text' }
        );
    }

    register(
        name: string,
        email: string,
        password: string
    ): Observable<string> {
        return this.http.post(
            `${url}/signup`,
            { name, email, password },
            { responseType: 'text' }
        );
    }
}
