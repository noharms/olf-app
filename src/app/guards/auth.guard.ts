import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { TOP_LEVEL_DOMAIN_NAME } from '../app-routing.module';

export const authGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): boolean => {
  if (inject(AuthenticationService).authToken != null) {
    return true;
  } else {
    console.warn("No authentication token found. Redirecting to the landing page.");
    inject(Router).navigateByUrl(TOP_LEVEL_DOMAIN_NAME);
    return false;
  };
};
