// src/app/app.config.ts

import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  isDevMode,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  provideHttpClient, 
  withFetch,
  withInterceptors,
} from '@angular/common/http';

import { routes } from './app.routes';
import { errorInterceptor } from './core/services/interceptors/error.interceptor';
import { jwtInterceptor } from './core/services/interceptors/jwt.interceptor';
import { loadingInterceptor } from './core/services/interceptors/loading.interceptor';
import { localeInterceptor } from './core/services/interceptors/locale.interceptor';
import { Chart, registerables } from 'chart.js';
// import { provideServiceWorker } from '@angular/service-worker';
import { PwaService } from './core/services/pwa.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes, 
      withComponentInputBinding(),  
      withViewTransitions(),        
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([
 
      jwtInterceptor,     
      errorInterceptor,   
      ]),
    ),

    provideClientHydration(withEventReplay()),

  ],
};
