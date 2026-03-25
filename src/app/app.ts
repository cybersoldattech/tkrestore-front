import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterOutlet } from '@angular/router';

import { SplashScreenComponent } from './core/splash/splash-screen.component';
import { AppStartupLoadingService } from './core/services/app-startup-loading.service';



@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, SplashScreenComponent],
  template: `
    <app-splash-screen />

      @if (!startup.isSplashVisible()) {
         <router-outlet />
      }

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly startup = inject(AppStartupLoadingService);
}

