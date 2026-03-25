// src/app/core/services/interceptors/error.interceptor.ts
// [FIX i18n] Messages d'erreur lus depuis LanguageService au lieu d'être hardcodés en FR

import {
  HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service';
import { LanguageService } from '../language.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router       = inject(Router);
  const notification = inject(NotificationService);
  const lang         = inject(LanguageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // ── Priorité 1 : message traduit retourné par le backend ──────────────
      // Laravel retourne toujours { message: '...' } localisé si SetLocale est actif
      const apiMessage: string | undefined = error.error?.message;

      // ── Priorité 2 : message localisé côté Angular (fallback) ─────────────
      // Utilisé si le backend n'a pas retourné de message (erreur réseau, 0, 429...)
      const t = lang.t();

      let userMessage: string;

      if (error.status === 0) {
        // Pas de connexion réseau / CORS
        userMessage = apiMessage ?? t.error?.E_network
          ?? 'Impossible de contacter le serveur. Vérifiez votre connexion.';
        notification.error(userMessage);

      } else if (error.status === 400) {
        userMessage = apiMessage ?? t.error?.E_validation
          ?? 'Données invalides.';
        if (apiMessage) notification.error(userMessage);
        if (!isProduction()) console.warn('[API 400]', error.error);

      } else if (error.status === 401) {
        // Géré par jwtInterceptor (logout) — on laisse remonter sans toast
        userMessage = apiMessage ?? t.error?.E_401
          ?? 'Non authentifié.';

      } else if (error.status === 403) {
        if (error.error?.action === 'verify_email') {
          router.navigate(['/auth/verify-email']);
          return throwError(() => error);
        }
        userMessage = apiMessage ?? t.error?.E_403
          ?? 'Vous n\'avez pas les droits pour effectuer cette action.';
        notification.error(userMessage);

      } else if (error.status === 404) {
        userMessage = apiMessage ?? t.error?.E_404
          ?? 'La ressource demandée est introuvable.';
        notification.warning(userMessage);

      } else if (error.status === 422) {
        // Erreurs de validation Laravel — le composant gère les champs
        userMessage = apiMessage ?? t.error?.E_validation
          ?? 'Veuillez vérifier les champs en erreur.';
        if (apiMessage) notification.warning(userMessage);

      } else if (error.status === 429) {
        userMessage = apiMessage ?? t.error?.E_429
          ?? 'Trop de requêtes. Veuillez patienter quelques instants.';
        notification.warning(userMessage);

      } else if (error.status >= 500) {
        userMessage = apiMessage ?? t.error?.E_500
          ?? 'Erreur serveur. Veuillez réessayer plus tard.';
        notification.error(userMessage);

      } else {
        userMessage = apiMessage ?? 'Une erreur inattendue s\'est produite.';
        if (error.status !== 401) notification.error(userMessage);
      }

      // Enrichir l'erreur pour les composants qui font leur propre catchError()
      const enriched = {
        ...error,
        userMessage,
        message: userMessage,
        validationErrors: error.error?.errors ?? null,
      };

      return throwError(() => enriched);
    }),
  );
};

function isProduction(): boolean {
  return typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost';
}