import { HttpInterceptorFn } from '@angular/common/http';
import { LS } from '../models/rbac.models';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(LS.accessToken);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
