import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionsService } from '../services/permissions.service';

export const globalOnlyGuard: CanActivateFn = () => {
  const permissions = inject(PermissionsService);
  const router = inject(Router);
  if (permissions.isGlobal()) return true;
  router.navigate(['/dashboard']);
  return false;
};

export const notGuardRoleGuard: CanActivateFn = () => {
  const permissions = inject(PermissionsService);
  const router = inject(Router);
  if (permissions.role !== 'Guard') return true;
  router.navigate(['/dashboard']);
  return false;
};
