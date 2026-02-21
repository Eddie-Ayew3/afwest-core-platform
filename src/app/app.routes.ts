import { Routes } from '@angular/router';
import { SignInComponent } from './features/auth/pages/sign-in';
import { DashboardComponent } from './features/dashboard/pages/dashboard';

export const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
