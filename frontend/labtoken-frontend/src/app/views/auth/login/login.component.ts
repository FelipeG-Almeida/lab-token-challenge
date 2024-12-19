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
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class LoginComponent implements OnInit {
    loginForm!: UntypedFormGroup;
    submitted: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
        });
    }

    get form() {
        return this.loginForm.controls;
    }

    login() {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }
        const email = this.form['email'].value;
        const password = this.form['password'].value;
        this.authService.login(email, password);
    }
}
