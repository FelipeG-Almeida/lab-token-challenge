import { Routes } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';
import { authGuard } from './guard/login.guard';
import { EventsComponents } from './views/events/events.component';
import { RegisterComponent } from './views/auth/register/register.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'events',
        pathMatch: 'full',
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'events',
        component: EventsComponents,
        canActivate: [authGuard],
    },
    {
        path: '**',
        redirectTo: 'login',
    },
];
