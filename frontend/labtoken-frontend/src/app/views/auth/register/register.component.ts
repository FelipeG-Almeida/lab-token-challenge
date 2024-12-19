import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class RegisterComponent implements OnInit {
    registerForm!: UntypedFormGroup;
    submitted: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.registerForm = this.formBuilder.group(
            {
                name: ['', [Validators.required, Validators.minLength(6)]],
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(8)]],
                confirmPassword: ['', Validators.required],
            },
            {
                validators: this.matchPasswords('password', 'confirmPassword'),
            }
        );
    }

    get form() {
        return this.registerForm.controls;
    }

    register() {
        this.submitted = true;
        if (this.registerForm.invalid) {
            return;
        }

        const { name, email, password } = this.registerForm.value;
        this.authService.register(name, email, password);
    }

    private matchPasswords(password: string, confirmPassword: string) {
        return (formGroup: UntypedFormGroup) => {
            const passControl = formGroup.controls[password];
            const confirmPassControl = formGroup.controls[confirmPassword];

            if (
                confirmPassControl.errors &&
                !confirmPassControl.errors['mustMatch']
            ) {
                return;
            }

            if (passControl.value !== confirmPassControl.value) {
                confirmPassControl.setErrors({ mustMatch: true });
            } else {
                confirmPassControl.setErrors(null);
            }
        };
    }
}
