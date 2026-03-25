import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LanguageService } from '../language.service';
import { environment } from '../../../../environments/environment';

/**
 * Injecte la locale active dans les headers HTTP afin que le backend
 * (middleware SetLocale) puisse positionner app()->setLocale().
 */
export const localeInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const lang = inject(LanguageService);

  // Uniquement pour les appels vers l'API
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const code = lang.currentCode();

  // header attendu par backend : X-App-Locale
  const cloned = req.clone({
    setHeaders: {
      'Accept-Language': code,
      'X-App-Locale': code,
    },
  });

  return next(cloned);
};

