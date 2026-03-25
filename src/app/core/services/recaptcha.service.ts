import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RecaptchaService {
  private readonly siteKey = environment['recaptchaSiteKey'] as string;

  private readonly isScriptLoaded = signal(false);
  private scriptLoadPromise: Promise<void> | null = null;

  private loadScriptOnce(): Promise<void> {
    if (!this.siteKey) {
      return Promise.reject(new Error('reCAPTCHA site key manquante.'));
    }

    if (typeof window === 'undefined') {
      return Promise.reject(new Error('reCAPTCHA indisponible en SSR.'));
    }

    if (this.isScriptLoaded()) {
      return Promise.resolve();
    }

    if (this.scriptLoadPromise) {
      return this.scriptLoadPromise;
    }

    this.scriptLoadPromise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[data-recaptcha-v3="true"]'
      );

      if (existing) {
        // Script déjà dans le DOM — attendre que grecaptcha soit prêt
        window.grecaptcha.ready(() => {
          this.isScriptLoaded.set(true);
          resolve();
        });
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.dataset['recaptchaV3'] = 'true';
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(this.siteKey)}`;

      script.onload = () => {
        // ← grecaptcha.ready() garantit que execute() est disponible
        window.grecaptcha.ready(() => {
          this.isScriptLoaded.set(true);
          resolve();
        });
      };

      script.onerror = () => {
        this.scriptLoadPromise = null; // permet un retry
        reject(new Error('Impossible de charger le script reCAPTCHA.'));
      };

      document.head.appendChild(script);
    });

    return this.scriptLoadPromise;
  }

  async execute(action: string): Promise<string> {
    if (!action) {
      throw new Error('Action reCAPTCHA requise.');
    }

    await this.loadScriptOnce();

    // grecaptcha.ready() est déjà passé, execute() est disponible
    const token = await window.grecaptcha.execute(this.siteKey, { action });

    if (!token) {
      throw new Error('Token reCAPTCHA vide.');
    }

    return token;
  }
}