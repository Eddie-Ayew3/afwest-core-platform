import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  InputComponent,
  ButtonComponent,
  LabelComponent
} from '@tolle_/tolle-ui';
import { DEMO_ACCOUNTS } from '../../../../core/data/demo-accounts.data';
import { LS } from '../../../../core/models/rbac.models';
import { environment } from '../../../../../environments/environment';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  userId: string;
  staffId?: string;
  email: string;
  fullName: string;
  role: string;
  scope: string;
  region?: string;
  siteName?: string;
  permissions: string[];
}

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

  staffId = '';
  password = '';

  demoAccounts = DEMO_ACCOUNTS;
  selectedDemoId = '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    if (localStorage.getItem(LS.isAuthenticated) === 'true') {
      this.router.navigate(['/dashboard']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  selectDemo(): void {
    const account = this.demoAccounts.find(a => a.staffId === this.selectedDemoId);
    if (account) {
      this.staffId = account.staffId;
      this.password = account.password;
    }
  }

  onSubmit(): void {
    if (!this.staffId.trim() || !this.password.trim()) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, {
      staffId: this.staffId,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        localStorage.setItem(LS.isAuthenticated, 'true');
        localStorage.setItem(LS.accessToken,     response.accessToken);
        localStorage.setItem(LS.refreshToken,    response.refreshToken);
        localStorage.setItem(LS.userStaffId,     response.staffId ?? response.userId);
        localStorage.setItem(LS.userDisplayName, response.fullName);
        localStorage.setItem(LS.userRole,        response.role);
        localStorage.setItem(LS.userScope,       response.scope);
        localStorage.setItem(LS.userRegion,      response.region ?? '');
        localStorage.setItem(LS.userSite,        response.siteName ?? '');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Invalid staff ID or password.';
      }
    });
  }
}
