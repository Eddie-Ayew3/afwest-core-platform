import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent, ButtonComponent, LabelComponent } from '@tolle_/tolle-ui';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, ButtonComponent, LabelComponent],
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  showConfirm = false;

  form = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.checkSetupStatus().subscribe({
      next: (status) => {
        if (!status.isRequired) this.router.navigate(['/sign-in']);
      },
      error: () => {}
    });
  }

  get passwordMismatch(): boolean {
    return !!this.form.confirmPassword && this.form.password !== this.form.confirmPassword;
  }

  get isValid(): boolean {
    return !!this.form.firstName && !!this.form.lastName &&
           !!this.form.email && this.form.password.length >= 8 &&
           this.form.password === this.form.confirmPassword;
  }

  onSubmit(): void {
    if (!this.isValid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.setupAdmin({
      firstName: this.form.firstName,
      lastName: this.form.lastName,
      email: this.form.email,
      password: this.form.password
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message ?? 'Setup failed. Please try again.';
      }
    });
  }
}
