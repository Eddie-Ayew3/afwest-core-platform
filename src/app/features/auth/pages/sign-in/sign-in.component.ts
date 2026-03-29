import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  InputComponent,
  ButtonComponent,
  LabelComponent
} from '@tolle_/tolle-ui';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputComponent,
    ButtonComponent,
    LabelComponent
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  email = '';
  password = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.authService.checkSetupStatus().subscribe({
      next: (status) => {
        if (status.isRequired) this.router.navigate(['/setup']);
      },
      error: () => {} // ignore — backend may not be running yet
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.email.trim() || !this.password.trim()) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email.trim(), this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Invalid email or password.';
      }
    });
  }
}
