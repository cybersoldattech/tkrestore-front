// src/app/core/guards/email-verified.guard.ts
//
// Redirige vers /auth/verify-email si l'user est connecté
// mais n'a pas encore vérifié son email.

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';


export const emailVerifiedGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  const user = auth.currentUser();
  
  // Email vérifié → accès autorisé
  if (user && user.email_verified_at) return true;

  // Email non vérifié → redirection vers la page de vérification
  return router.createUrlTree(['/auth/verify-email']);
};
