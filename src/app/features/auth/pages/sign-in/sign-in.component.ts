import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  InputComponent,
  ButtonComponent,
  LabelComponent
} from '@tolle_/tolle-ui';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    FormsModule,
    InputComponent,
    ButtonComponent,
    LabelComponent
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  showPassword = false;
  isLoading = false;

  // Form model
  staffId = '';
  password = '';

  constructor(private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      // Handle sign-in logic here
      console.log('Signing in with:', this.staffId, this.password);
      
      // Navigate to dashboard on successful sign-in
      this.router.navigate(['/dashboard']);
    }, 1500);
  }
}