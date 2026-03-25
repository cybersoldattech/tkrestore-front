// src/app/core/guards/role.guard.ts
//
// Rôle : restreint l'accès aux routes qui nécessitent un rôle
//        spécifique (ex: admin). Utilise data.roles dans la config
//        de la route.
//
// Usage dans app.routes.ts :
//   {
//     path: 'admin',
//     canActivate: [authGuard, roleGuard],
//     data: { roles: ['admin'] },
//     ...
//   }

import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';


export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = (route.data['roles'] as string[]) ?? [];
  const userRole      = auth.currentUser()?.role;

  if (!userRole || !requiredRoles.includes(userRole)) {
    // Redirige vers le dashboard plutôt que d'afficher une erreur brute
    return router.createUrlTree(['/app/dashboard']);
  }

  return true;
};
