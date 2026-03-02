import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  InputComponent,
  ButtonComponent,
  LabelComponent
} from '@tolle_/tolle-ui';
import { DEMO_ACCOUNTS } from '../../../../core/data/demo-accounts.data';
import { LS } from '../../../../core/models/rbac.models';

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

  staffId = '';
  password = '';

  demoAccounts = DEMO_ACCOUNTS;
  selectedDemoId = '';

  constructor(private router: Router) {}

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
    setTimeout(() => {
      this.isLoading = false;

      const account = this.demoAccounts.find(
        a => a.staffId === this.staffId && a.password === this.password
      );

      if (account) {
        localStorage.setItem(LS.isAuthenticated, 'true');
        localStorage.setItem(LS.userStaffId,     account.staffId);
        localStorage.setItem(LS.userDisplayName, account.displayName);
        localStorage.setItem(LS.userRole,        account.role);
        localStorage.setItem(LS.userScope,       account.scope);
        localStorage.setItem(LS.userRegion,      account.region  ?? '');
        localStorage.setItem(LS.userSite,        account.site    ?? '');
      } else {
        // Fallback: grant global admin access for unknown credentials
        localStorage.setItem(LS.isAuthenticated, 'true');
        localStorage.setItem(LS.userStaffId,     this.staffId);
        localStorage.setItem(LS.userDisplayName, this.staffId);
        localStorage.setItem(LS.userRole,        'Admin');
        localStorage.setItem(LS.userScope,       'global');
        localStorage.setItem(LS.userRegion,      '');
        localStorage.setItem(LS.userSite,        '');
      }

      this.router.navigate(['/dashboard']);
    }, 1000);
  }
}
