import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputComponent, ButtonComponent, ToastService } from '@tolle_/tolle-ui';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, InputComponent, ButtonComponent],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mode: 'request' | 'reset' = 'request';
  token: string = '';
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  submitting: boolean = false;

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (this.token) {
      this.mode = 'reset';
    }
  }

  onRequestReset() {
    if (!this.email) return;
    this.submitting = true;
    this.auth.forgotPassword(this.email).subscribe({
      next: () => {
        this.submitting = false;
        this.toast.show({ title: 'Reset Link Sent', description: `If an account exists with ${this.email}, a reset link has been sent.`, variant: 'success' });
      },
      error: () => {
        this.submitting = false;
        this.toast.show({ title: 'Error', description: 'Failed to send reset link', variant: 'destructive' });
      }
    });
  }

  onResetPassword() {
    if (!this.newPassword || !this.confirmPassword || this.newPassword !== this.confirmPassword) {
      this.toast.show({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (this.newPassword.length < 8) {
      this.toast.show({ title: 'Error', description: 'Password must be at least 8 characters', variant: 'destructive' });
      return;
    }
    this.submitting = true;
    this.auth.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.submitting = false;
        this.toast.show({ title: 'Password Reset', description: 'Your password has been reset. Redirecting to sign in...', variant: 'success' });
        setTimeout(() => this.router.navigate(['/sign-in']), 2000);
      },
      error: () => {
        this.submitting = false;
        this.toast.show({ title: 'Error', description: 'Invalid or expired reset token', variant: 'destructive' });
      }
    });
  }

  onSubmit() {
    if (this.mode === 'request') {
      this.onRequestReset();
    } else {
      this.onResetPassword();
    }
  }
}