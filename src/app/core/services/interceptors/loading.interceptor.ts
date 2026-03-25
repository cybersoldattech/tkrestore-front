// src/app/core/interceptors/loading.interceptor.ts
//
// Rôle : expose un signal `isLoading` global qui passe à true
//        dès qu'une requête HTTP est en cours, et revient à false
//        quand toutes sont terminées.
//        Utilisable dans n'importe quel composant via inject(LoadingService).

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../loading.service';


export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);

  // Ne pas afficher le loader pour les requêtes silencieuses
  // (ex: polling, refresh token)
  const silent = req.headers.has('X-Silent');
  if (silent) {
    return next(req.clone({ headers: req.headers.delete('X-Silent') }));
  }

  loading.increment();

  return next(req).pipe(
    finalize(() => loading.decrement()),
  );
};
