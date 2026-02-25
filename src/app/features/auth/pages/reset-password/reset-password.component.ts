import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent, ButtonComponent } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, InputComponent, ButtonComponent],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  email: string = '';
  submitting: boolean = false;

  onSubmit() {
    if (this.email) {
      this.submitting = true;
      console.log('Password reset link requested for:', this.email);
      // TODO: Call your auth service here (e.g. this.authService.requestPasswordReset(this.email))
      // For demo:
      setTimeout(() => {
        alert(`Reset link sent to ${this.email} (demo mode)`);
        this.submitting = false;
      }, 1500);
    }
  }
}