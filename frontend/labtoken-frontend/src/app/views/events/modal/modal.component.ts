import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreateEvent, Event } from '../../../models/event';
import {
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventsGateway } from '../../../gateways/events.gateway';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css'],
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, CommonModule],
})
export class ModalComponent implements OnInit {
    @Input() event!: Event;
    @Output() close = new EventEmitter<void>();
    eventForm!: FormGroup;
    submitted: boolean = false;
    invalidGuest: boolean = false;
    invitedUsers: string[] = [];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private eventsGateway: EventsGateway,
        private toastService: ToastrService
    ) {}

    ngOnInit(): void {
        this.eventForm = this.formBuilder.group({
            description: [this.event.description || '', [Validators.required]],
            startTime: [this.event.startTime || '', [Validators.required]],
            endTime: [this.event.endTime || '', [Validators.required]],
            invitedUsers: ['', [Validators.email]],
        });
    }

    get form() {
        return this.eventForm.controls;
    }

    inviteUser() {
        if (
            this.form['invitedUsers'].errors &&
            this.form['invitedUsers'].errors['email']
        ) {
            this.invalidGuest = true;
            return;
        }
        const email = this.form['invitedUsers'].value;
        if (email) {
            this.invitedUsers.push(email);
            this.form['invitedUsers'].reset();
        }
        this.invalidGuest = false;
    }

    deleteInvite(user: string) {
        const index = this.invitedUsers.indexOf(user);
        if (index !== -1) this.invitedUsers.splice(index, 1);
    }

    closeModal() {
        this.close.emit();
    }

    createEvent(event: CreateEvent) {
        this.eventsGateway.createEvent(event).subscribe({
            next: () => {
                this.toastService.success('Evento criado com sucesso!');
                this.closeModal();
            },
            error: (error) => {
                this.toastService.error(error.error);
            },
        });
    }

    updateEvent(id: string, event: CreateEvent) {
        this.eventsGateway.updateEvent(id, event).subscribe({
            next: () => {
                this.toastService.success('Evento atualizado com sucesso!');
                this.closeModal();
            },
            error: (error) => {
                this.toastService.error(error.error);
            },
        });
    }

    deleteEvent() {
        this.eventsGateway.deleteEvent(this.event.id).subscribe({
            next: () => {
                this.toastService.info('Evento deletado com sucesso!');
                this.closeModal();
            },
            error: (error) => {
                this.toastService.error(error.error);
            },
        });
    }

    handleSubmit() {
        this.submitted = true;
        if (this.eventForm.invalid) {
            return;
        }

        const { description, startTime, endTime } = this.eventForm.value;
        const event: CreateEvent = {
            description,
            startTime,
            endTime,
            invitedUsers: this.invitedUsers,
        };

        if (this.event.id) {
            this.updateEvent(this.event.id, event);
        } else {
            this.createEvent(event);
        }
    }
}
