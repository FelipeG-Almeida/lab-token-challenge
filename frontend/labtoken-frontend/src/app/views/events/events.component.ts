import { Component, OnInit } from '@angular/core';
import { EventsGateway } from '../../gateways/events.gateway';
import { ToastrService } from 'ngx-toastr';
import { Event } from '../../models/event';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.css'],
    standalone: true,
    imports: [CommonModule, ModalComponent],
})
export class EventsComponents implements OnInit {
    events: Event[] = [];
    selectedEvent!: Event;
    modalVisible: boolean = false;
    dropDownVisible: boolean = false;
    userId: string;

    constructor(
        private eventsGateway: EventsGateway,
        private toastService: ToastrService,
        public authService: AuthService
    ) {
        this.userId = authService.getUserId();
    }

    ngOnInit(): void {
        this.listEvents();
        this.authService.getUserId();
    }

    listEvents() {
        this.eventsGateway.listEvents().subscribe({
            next: (result) => {
                this.events = result;
            },
            error: (error) => {
                this.toastService.error(error.error);
            },
        });
    }

    formatDate(date: string): string {
        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        };

        const dateInBrasilia = new Date(date).toLocaleString('pt-BR', {
            ...options,
            timeZone: 'America/Sao_Paulo',
        });

        return dateInBrasilia;
    }

    isInvited(event: Event): boolean {
        return event.invitedUsers.some((guest) => guest.user_id == this.userId);
    }

    guestStatus(event: Event): string {
        return (
            event.invitedUsers.find((guest) => guest.user_id == this.userId)
                ?.status || ''
        );
    }

    changeStatus(e: any, event: Event) {
        const newStatus = e.target.value;
        this.eventsGateway.changeStatus(event.id, newStatus).subscribe({
            next: () => {
                if (newStatus === 'CONFIRMED') {
                    this.toastService.success('Convite aceito');
                } else if (newStatus === 'CANCELED') {
                    this.toastService.success('Convite rejeitado');
                } else {
                    this.toastService.success('Convite pendente');
                }
                this.listEvents();
            },
            error: (error) => {
                this.toastService.error(error.error || error.message);
            },
        });
    }

    openDropdown() {
        this.dropDownVisible = !this.dropDownVisible;
    }

    openModal(event?: Event) {
        this.selectedEvent = event || ({} as Event);
        this.modalVisible = true;
    }

    closeModal() {
        this.modalVisible = false;
        this.listEvents();
    }
}
