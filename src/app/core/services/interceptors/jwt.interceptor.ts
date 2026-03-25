import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../auth.service';
import { TokenStorageService } from '../token-storage.service';

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const storage = inject(TokenStorageService);
  const auth    = inject(AuthService);

  // Ne pas toucher aux requêtes externes ou aux routes d'auth
  if (!req.url.startsWith(environment.apiUrl) || isAuthRoute(req.url)) {
    return next(req);
  }

  // Injecter le token si disponible
  const token   = storage.getAccessToken();
  const authReq = token ? addToken(req, token) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Avec Sanctum : 401 = token invalide ou expiré
        // Pas de refresh possible → déconnexion directe
        auth.logout();
      }
      return throwError(() => error);
    }),
  );
};

// ── Helpers ───────────────────────────────────────────────────────────

function addToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

function isAuthRoute(url: string): boolean {
  return (
    url.includes('/auth/login') ||
    url.includes('/auth/register')
    // /auth/logout garde le token pour pouvoir le révoquer côté serveur
  );
}