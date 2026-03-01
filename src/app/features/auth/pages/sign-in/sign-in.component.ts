import { Component, OnInit } from '@angular/core';
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
export class SignInComponent implements OnInit {
  showPassword = false;
  isLoading = false;

  // Form model
  staffId = '';
  password = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check if user is already authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.staffId.trim() || !this.password.trim()) {
      // Don't submit if fields are empty
      return;
    }

    this.isLoading = true;
    
    // Simulate API call with validation
    setTimeout(() => {
      this.isLoading = false;
      
      // Handle sign-in logic here
      console.log('Signing in with:', this.staffId, this.password);
      
      // Store authentication state (in real app, you'd use a service)
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userStaffId', this.staffId);
      localStorage.setItem('userName', `${this.staffId} User`);
      
      // Navigate to dashboard on successful sign-in
      this.router.navigate(['/dashboard']).then(() => {
        console.log('Navigation to dashboard successful');
      }).catch((error) => {
        console.error('Navigation failed:', error);
      });
    }, 1000); // Simulate network delay
  }
}