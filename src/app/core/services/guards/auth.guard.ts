// src/app/core/guards/auth.guard.ts
//
// Rôle : bloque l'accès aux routes /app/* si l'utilisateur
//        n'est pas connecté. Redirige vers /auth/login avec
//        la route demandée en paramètre (returnUrl) pour
//        pouvoir y revenir après connexion.

import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
import { TokenStorageService } from '../token-storage.service';


export const authGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const storage = inject(TokenStorageService);
  const auth    = inject(AuthService);
  const router  = inject(Router);

  // Token valide → accès autorisé
  if (storage.hasValidToken() && auth.isLoggedIn()) {
    return true;
  }

  // Token expiré mais refresh token présent → on essaie de rafraîchir
  // (le jwtInterceptor s'en charge automatiquement sur la 1ère requête)
  // Ici on vérifie juste si un refresh token existe pour décider
  // if (storage.getRefreshToken()) {
  //   // On laisse passer, l'interceptor gérera le refresh
  //   return true;
  // }

  // Pas de session → redirection vers login avec returnUrl
  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url },
  });
};
