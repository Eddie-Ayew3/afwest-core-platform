import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { LS } from '../models/rbac.models';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        Object.values(LS).forEach(key => localStorage.removeItem(key));
        router.navigate(['/sign-in']);
      }
      return throwError(() => error);
    })
  );
};
