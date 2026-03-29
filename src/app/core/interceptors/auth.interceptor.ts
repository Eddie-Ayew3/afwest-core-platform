import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { LS } from '../models/rbac.models';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const token = localStorage.getItem(LS.accessToken);

  const authReq = token ? addToken(req, token) : req;

  return next(authReq).pipe(
    catchError((error): Observable<HttpEvent<unknown>> => {
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        return handle401Error(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
}

function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = localStorage.getItem(LS.refreshToken);
    const accessToken = localStorage.getItem(LS.accessToken);

    if (!refreshToken || !accessToken) {
      isRefreshing = false;
      authService.logout();
      return throwError(() => ({ status: 401 }));
    }

    return authService.refreshToken(accessToken, refreshToken).pipe(
      switchMap((response): Observable<HttpEvent<unknown>> => {
        isRefreshing = false;
        localStorage.setItem(LS.accessToken, response.accessToken);
        localStorage.setItem(LS.refreshToken, response.refreshToken);
        refreshTokenSubject.next(response.accessToken);
        return next(addToken(req, response.accessToken));
      }),
      catchError((refreshError): Observable<HttpEvent<unknown>> => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => refreshError);
      })
    );
  }

  return refreshTokenSubject.pipe(
    filter((token): token is string => token !== null),
    take(1),
    switchMap(token => next(addToken(req, token)))
  );
}
