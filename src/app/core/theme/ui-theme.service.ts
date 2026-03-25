// import { Injectable, signal } from '@angular/core';

// export type UiThemeMode = 'light' | 'dark';

// @Injectable({ providedIn: 'root' })
// export class UiThemeService {
//   readonly mode = signal<UiThemeMode>(this.getInitialMode());

//   constructor() {
//     this.applyToDom(this.mode());
//   }

//   toggle(): void {
//     this.setMode(this.mode() === 'dark' ? 'light' : 'dark');
//   }

//   setMode(mode: UiThemeMode): void {
//     this.mode.set(mode);
//     this.persist(mode);
//     this.applyToDom(mode);
//   }

//   private getInitialMode(): UiThemeMode {
//     if (typeof window === 'undefined') return 'dark';
//     const stored = window.localStorage.getItem('tkrestore.theme');
//     if (stored === 'light' || stored === 'dark') return stored;
//     const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
//     return prefersDark ? 'dark' : 'light';
//   }

//   private persist(mode: UiThemeMode): void {
//     if (typeof window === 'undefined') return;
//     window.localStorage.setItem('tkrestore.theme', mode);
//   }

//   private applyToDom(mode: UiThemeMode): void {
//     if (typeof document === 'undefined') return;
//     document.documentElement.classList.toggle('dark', mode === 'dark');
//     document.documentElement.setAttribute('data-theme', mode);
//   }
// }


import { Injectable, signal } from '@angular/core';

export type UiThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class UiThemeService {
  readonly mode = signal<UiThemeMode>(this.getInitialMode());

  constructor() {
    // Appliquer immédiatement au démarrage (avant le premier rendu)
    this.applyToDom(this.mode());
  }

  toggle(): void {
    this.setMode(this.mode() === 'dark' ? 'light' : 'dark');
  }

  setMode(mode: UiThemeMode): void {
    this.mode.set(mode);
    this.persist(mode);
    this.applyToDom(mode);
  }

  private getInitialMode(): UiThemeMode {
    if (typeof window === 'undefined') return 'dark';
    const stored = window.localStorage.getItem('tkrestore.theme');
    if (stored === 'light' || stored === 'dark') return stored;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  private persist(mode: UiThemeMode): void {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('tkrestore.theme', mode);
  }

  private applyToDom(mode: UiThemeMode): void {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;

    // 1. Classe Tailwind v4 — active le @variant dark
    html.classList.toggle('dark', mode === 'dark');

    // 2. data-theme — active le thème DaisyUI v5
    html.setAttribute('data-theme', mode);

    // 3. color-scheme — informe le navigateur (scrollbars, inputs natifs...)
    html.style.colorScheme = mode;
  }
}