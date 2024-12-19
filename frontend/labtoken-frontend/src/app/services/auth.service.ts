import { Injectable } from '@angular/core';
import { AuthGateway } from '../gateways/auth.gateway';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Token } from '../models/token';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private toastService: ToastrService,
        private authGateway: AuthGateway,
        private router: Router
    ) {}

    login(email: string, password: string) {
        this.authGateway.login(email, password).subscribe({
            next: (token) => {
                localStorage.setItem('session', token);
                this.toastService.success('Bem vindo');
                this.router.navigate(['events']);
            },
            error: (error) => {
                this.toastService.error(error.error);
            },
        });
    }

    register(name: string, email: string, password: string) {
        this.authGateway.register(name, email, password).subscribe({
            next: (token) => {
                localStorage.setItem('session', token);
                this.toastService.success('Bem vindo');
                this.router.navigate(['events']);
            },
            error: (error) => {
                this.toastService.error(error.error);
            },
        });
    }

    logOut() {
        localStorage.removeItem('session');
        this.router.navigate(['login']);
    }

    isLoggedIn() {
        const token = localStorage.getItem('session');
        if (token) {
            return true;
        }
        return false;
    }

    getUserId(): string {
        try {
            const token = localStorage.getItem('session');
            if (token) {
                const decoded: Token = jwtDecode(token);
                return decoded.id;
            }
            return '';
        } catch (error) {
            console.log(error);
            return '';
        }
    }
}
