import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputComponent, ButtonComponent, ToastService } from '@tolle_/tolle-ui';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, InputComponent, ButtonComponent],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  private toast = inject(ToastService);
  email: string = '';
  submitting: boolean = false;

  onSubmit() {
    if (this.email) {
      this.submitting = true;
      setTimeout(() => {
        this.submitting = false;
        this.toast.show({ title: 'Reset Link Sent', description: `A password reset link has been sent to ${this.email}.`, variant: 'success' });
      }, 1500);
    }
  }
}