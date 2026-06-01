import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (
    isPlatformBrowser(platformId) &&
    localStorage.getItem('isLoggedIn') === 'true' &&
    localStorage.getItem('userRole') === 'admin'
  ) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
