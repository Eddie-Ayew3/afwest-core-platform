import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, tap, throwError, switchMap, filter, take, map } from 'rxjs';

import { LS } from '../models/rbac.models';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  userId: string;
  staffId: string;
  email: string;
  fullName: string;
  role: string;
  scope: string;
  permissions: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private base = environment.apiUrl;

  private isRefreshing = new BehaviorSubject<boolean>(false);
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  checkSetupStatus(): Observable<{ isRequired: boolean }> {
    return this.http.get<{ isRequired: boolean }>(`${this.base}/setup/status`);
  }

  setupAdmin(dto: { email: string; password: string; firstName: string; lastName: string }): Observable<LoginResponse> {
    return this.http.post<{ loginResponse: LoginResponse }>(`${this.base}/setup/admin`, dto).pipe(
      tap(res => this.storeTokens(res.loginResponse)),
      map(res => res.loginResponse)
    );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/auth/login`, { email, password }).pipe(
      tap(response => this.storeTokens(response))
    );
  }

  refreshToken(accessToken: string, refreshToken: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.base}/auth/refresh`, { accessToken, refreshToken }).pipe(
      tap(response => this.storeTokens(response))
    );
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.base}/auth/reset-password`, { token, newPassword });
  }

  private storeTokens(response: LoginResponse): void {
    localStorage.setItem(LS.isAuthenticated, 'true');
    localStorage.setItem(LS.accessToken, response.accessToken);
    localStorage.setItem(LS.refreshToken, response.refreshToken);
    localStorage.setItem(LS.userId, response.userId);
    localStorage.setItem(LS.userEmail, response.email);
    localStorage.setItem(LS.userStaffId, response.staffId);
    localStorage.setItem(LS.userFullName, response.fullName);
    localStorage.setItem(LS.userRole, response.role);
    localStorage.setItem(LS.userScope, response.scope);
    localStorage.setItem(LS.userPermissions, JSON.stringify(response.permissions));
  }

  logout(): void {
    this.clearTokens();
    this.router.navigate(['/sign-in']);
  }

  isAuthenticated(): boolean {
    return localStorage.getItem(LS.isAuthenticated) === 'true';
  }

  getAccessToken(): string | null {
    return localStorage.getItem(LS.accessToken);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(LS.refreshToken);
  }

  clearTokens(): void {
    Object.values(LS).forEach(key => localStorage.removeItem(key));
  }

  setRefreshing(value: boolean): void {
    this.isRefreshing.next(value);
  }

  get isTokenRefreshing$() {
    return this.isRefreshing.asObservable();
  }

  setRefreshToken(token: string | null): void {
    this.refreshTokenSubject.next(token);
  }

  get refreshToken$() {
    return this.refreshTokenSubject.asObservable();
  }
}
