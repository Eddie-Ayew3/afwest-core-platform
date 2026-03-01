import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (isAuthenticated) {
    return true;
  } else {
    // Redirect to sign-in page
    router.navigate(['/sign-in']);
    return false;
  }
};
