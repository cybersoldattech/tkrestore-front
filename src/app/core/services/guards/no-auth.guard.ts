// src/app/core/guards/no-auth.guard.ts
//
// Rôle : empêche un utilisateur déjà connecté d'accéder
//        aux pages /auth/login et /auth/register.
//        Le redirige vers /app/dashboard.

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { TokenStorageService } from '../token-storage.service';


export const noAuthGuard: CanActivateFn = () => {
  const storage = inject(TokenStorageService);
  const auth    = inject(AuthService);
  const router  = inject(Router);

  if (storage.hasValidToken() && auth.isLoggedIn()) {
    return router.createUrlTree(['/app/dashboard']);
  }

  return true;
};
